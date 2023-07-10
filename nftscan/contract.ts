import { BigNumber, ethers, providers } from 'ethers'
import { JsonRpcProvider } from '@ethersproject/providers'
import { MulticallWrapper } from 'ethers-multicall-provider'
import { redis } from './src/io/redis'
import { cpus } from 'os'
import cluster from 'cluster'
import prisma from './src/io/prisma'

class Monitor {
	private redis: any

	constructor(redis: any) {
		this.redis = redis
	}

	public async check() {
		const syncedBlockNumber = await this.redis.SMEMBERS(
			'synced_block_number'
		)
		if (syncedBlockNumber.length > 0) {
			const sortedSyncedBlockNumber = syncedBlockNumber.sort(
				(a: number, b: number) => Number(a) - Number(b)
			)
			const firstBlockNumber = Number(sortedSyncedBlockNumber[0])
			const lastBlockNumber = Number(
				sortedSyncedBlockNumber[sortedSyncedBlockNumber.length - 1]
			)
			const blockNumber = await redis.SMEMBERS('all_block_number')
			const sortedBlockNumber = blockNumber.sort(
				(a: any, b: any) => Number(a) - Number(b)
			)
			const firstBlockNumber2 = Number(sortedBlockNumber[0])
			const lastBlockNumber2 = Number(
				sortedBlockNumber[sortedBlockNumber.length - 1]
			)
			if (
				firstBlockNumber === firstBlockNumber2 &&
				lastBlockNumber === lastBlockNumber2
			) {
				return
			}
			const missingBlockNumber = []
			for (let i = firstBlockNumber; i <= lastBlockNumber; i++) {
				if (!sortedSyncedBlockNumber.includes(i.toString())) {
					missingBlockNumber.push(i)
				}
			}
			for (const blockNumber of missingBlockNumber) {
				await this.redis.SADD(
					'all_block_number',
					blockNumber.toString()
				)
			}
		}
	}
}

class Watcher {
	private redis: any
	private provider: JsonRpcProvider

	constructor(redis: any, provider: JsonRpcProvider) {
		this.redis = redis
		this.provider = provider
	}
	public watchNewBlock() {
		this.provider.on('block', async (blockNumber: number) => {
			try {
				await this.redis.sAdd(
					'all_block_number',
					blockNumber.toString()
				)
				const subscriber = this.redis.duplicate()
				subscriber.on('error', (err: any) => console.error(err))
				await subscriber.connect()

				subscriber.publish('channel', blockNumber.toString())
			} catch (error) {
				console.error('Error processing block', error)
			}
		})
		//emitted on any error
		this.provider.on('error', (error: any) => {
			console.error('sub new block header error', error)
			return
		})
	}
}

class Worker {
	public async isErc721OrErc1155Contract(
		address: string,
		byteCode: string,
		provider: JsonRpcProvider
	) {
		try {
			const contract = new ethers.Contract(
				address,
				[
					'function supportsInterface(bytes4 interfaceId) external view returns (bool)',
				],
				provider
			)
			const isNFT = await contract.callStatic.supportsInterface(byteCode)
			return isNFT
		} catch (error) {
			return false
		}
	}

	private static createRequestPool(limit: number) {
		const queue: any = []
		const runningQueue = new Set()

		function run() {
			if (runningQueue.size >= limit) return
			const remainSpace = limit - runningQueue.size
			queue.splice(0, remainSpace).forEach((fn: any) => {
				runningQueue.add(fn)
				fn().then(() => {
					runningQueue.delete(fn)
					run()
				})
			})
		}
		return (request: any) => {
			return new Promise((resolve, reject) => {
				queue.push(async () => {
					const result = await request()
					resolve(result)
				})
				run()
			})
		}
	}

	public static async processBlock(
		provider: JsonRpcProvider,
		blockNumber: number
	) {
		const block = await provider.getBlock(blockNumber)
		console.log('start parse blockNumber:', blockNumber)
		if (!block || !block.transactions || block.transactions.length <= 0) {
			await redis.SADD('synced_block_number', blockNumber.toString())
			return
		}

		try {
			const limeRequest = Worker.createRequestPool(100)
			const transactionHashes = block.transactions
			for (const transactionHash of transactionHashes) {
				limeRequest(() => {
					provider
						.getTransaction(transactionHash)
						.then(async (transaction: any) => {
							if (
								transaction &&
								transaction.data.length > 2 &&
								transaction.to !== null
							) {
								const address = transaction.to as string

								redis.SADD('contract_addresses_set', address)
								try {
									await prisma.transaction.create({
										data: {
											hash: transaction.hash,
											block_number: blockNumber,
											block_hash:
												transaction.blockHash as string,
											from: transaction.from,
											to: transaction.to as string,
											value: transaction.value.toString(),
											nonce: transaction.nonce,
											data: transaction.data,
											timestamp: block.timestamp,
											type: transaction.type as number,
											chain_id: transaction.chainId,
											confirmations:
												transaction.confirmations,
											raw: transaction.raw as string,
										},
									})
								} catch (error) {
									console.log('hash', transaction.hash)
								}
							}
						})
				})
			}
			await redis.SADD('synced_block_number', blockNumber.toString())
		} catch (error) {
			console.error('Error processing block', error)
			await redis.SADD('all_block_number', blockNumber.toString())
		}
	}

	public transBigNumber(object: BigNumber | number | string) {
		let isBig = ethers.BigNumber.isBigNumber(object)
		if (isBig) {
			return object.toString()
		}
		return object
	}

	public async upsertNftContract(provider: JsonRpcProvider) {
		const MULTICALL_PROVIDER = MulticallWrapper.wrap(provider)
		const PROVIDER = provider
		const nftContractAddress = await redis.sPop(
			'contract_addresses_set',
			100
		)
		if (nftContractAddress.length === 0) {
			console.log('no nft contract address')
			return
		}
		const batchRequest = Worker.createRequestPool(10)
		const requests = () =>
			nftContractAddress.map(async (address: string) => {
				try {
					const ERC721_BYTE_CODE = '0x80ac58cd'
					const ERC1155_BYTE_CODE = '0xd9b67a26'
					const isErc721 = await this.isErc721OrErc1155Contract(
						address,
						ERC721_BYTE_CODE,
						PROVIDER
					)

					const isErc1155 = await this.isErc721OrErc1155Contract(
						address,
						ERC1155_BYTE_CODE,
						PROVIDER
					)
					if (!isErc721 && !isErc1155) {
						await redis.sAdd(
							'not_nft_contract_addresses_set',
							address
						)
						return
					}
					console.log('nft address', address)
					const contract = new ethers.Contract(
						address,
						[
							'function name() external view returns (string memory)',
							'function symbol() external view returns (string memory)',
							'function totalSupply() external view returns (uint256)',
							'function owner() external view returns (address)',
							'function balanceOf(address owner) external view returns (uint256 balance)',
							'function tokenURI(uint256 tokenId) external view returns (string memory)',
						],
						MULTICALL_PROVIDER
					)
					const result = await Promise.all([
						contract.callStatic.name(),
						contract.callStatic.symbol(),
						contract.callStatic.totalSupply(),
						contract.callStatic.owner(),
					])
					await prisma.nftContract.upsert({
						where: {
							contract_addr: address,
						},
						update: {},
						create: {
							name: result[0],
							symbol: result[1],
							total_supply: parseInt(
								this.transBigNumber(result[2]) as string
							),
							type: isErc721 ? 'erc721' : 'erc1155',
							contract_addr: address,
							creator: result[3],
							chain_id: 1,
						},
					})
					await redis.sRem('contract_addresses_set', address)
				} catch (error) {
					console.log('address', address)
				}
			})
		batchRequest(requests).then(async () => {
			const remaining = await redis.sCard('contract_addresses_set')
			if (remaining > 0) {
				setTimeout(() => this.upsertNftContract(provider), 3000)
			} else {
				setTimeout(() => this.upsertNftContract(provider), 20000)
			}
		})
	}
}

async function startSync() {
	const jsonRpcProvider = new ethers.providers.JsonRpcProvider(
		'https://eth-mainnet.g.alchemy.com/v2/d1OxOKceR7WNM0woxV_axXtV4SZh9-Lk'
	)

	let PROVIDER = jsonRpcProvider
	PROVIDER.on('error', async (error: any) => {
		console.error('PROVIDER is error, 3s reconnect', error)
		setTimeout(() => {
			PROVIDER = new ethers.providers.WebSocketProvider(
				'https://eth-mainnet.g.alchemy.com/v2/d1OxOKceR7WNM0woxV_axXtV4SZh9-Lk'
			)
		}, 3000)
	})
	const connectRedis = async () => {
		if (redis.isOpen) return
		await redis.connect()
		redis.on('ready', () => {
			console.log('Redis is ready')
		})
		redis.on('connect', () => {
			console.log('already connect to Redis')
		})
		redis.on('error', (error: any) => {
			console.error('Redis connect error', error)
		})
		redis.on('close', () => {
			setTimeout(() => {
				console.log('reconnect Redis...')
				connectRedis()
			}, 3000)
		})
	}
	await connectRedis()

	let workerMap = new Map<number, boolean>()
	if (cluster.isPrimary) {
		const monitor = new Monitor(redis)
		setInterval(async () => {
			await monitor.check()
		}, 10000)

		const watcher = new Watcher(redis, PROVIDER)
		await watcher.watchNewBlock()

		const worker = new Worker()
		await worker.upsertNftContract(PROVIDER)

		const cpuCores = cpus().length
		for (let i = 0; i < cpuCores; i++) {
			cluster.fork()
		}
		cluster.on('disconnect', (worker: any) => {
			console.log(`worker process #${worker.id} is disconnected`)
		})
		cluster.on('exit', (worker: any, code: any, signal: any) => {
			console.log(
				'worker process %d is disconnected (%s). reconnect...',
				worker.process.pid,
				signal || code
			)
			cluster.fork()
		})
		cluster.on('fork', (worker: any) => {
			console.log(`worker #${worker.id} is forked`)
		})
	} else if (cluster.isWorker) {
		workerMap.set(process.pid, true)
		const subscriber = redis.duplicate()
		subscriber.on('error', (err: any) => console.error(err))
		await subscriber.connect()
		subscriber.subscribe('channel', async (channel, message) => {
			const tasks = await redis.sMembers('all_block_number')
			let remainTask = tasks.length
			if (remainTask < workerMap.size) {
				const spaceMap = new Map<number, boolean>(
					Array.from(workerMap).filter(
						([key, value]) => value === true
					)
				)
				if (spaceMap.size === 0) {
					return
				}
				const blockNumber =
					tasks[Math.floor(Math.random() * tasks.length)]
				const randomWorker = Array.from(spaceMap.keys())[
					Math.floor(Math.random() * spaceMap.size)
				]
				workerMap.set(randomWorker, false)

				await Worker.processBlock(PROVIDER, parseInt(blockNumber))
				await redis.SREM('all_block_number', blockNumber.toString())
				workerMap.set(randomWorker, true)
				return
			} else {
				for (const [key, isSpace] of workerMap) {
					if (isSpace) {
						workerMap.set(key, false)
						const blockNumber =
							tasks[Math.floor(Math.random() * tasks.length)]
						await redis.SREM(
							'all_block_number',
							blockNumber.toString()
						)

						await Worker.processBlock(
							PROVIDER,
							parseInt(blockNumber)
						)
						workerMap.set(key, true)
					}
				}
			}
		})
	}
}

startSync()
