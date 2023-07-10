// nft 合约信息
/** source/controllers/posts.ts */
import { Request, Response, NextFunction } from 'express'
import prisma from '../io/prisma'
import { nftContract } from '@prisma/client'
import asyncHandler from 'express-async-handler'

interface PaginationResult<T> {
	data: T[]
	total: number
	totalPages: number
	nextPage: number | null
	prevPage: number | null
}

interface BaseResponse {
	code: number
	msg: string
	data: any
}

const getNftList = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const pageNumber = parseInt(req.query.pageNumber as string) || 1
		const pageSize = parseInt(req.query.pageSize as string) || 10

		const offset = (pageNumber - 1) * pageSize
		const limit = pageSize

		const [results, total] = await Promise.all([
			prisma.nftContract.findMany({
				skip: offset,
				take: limit,
			}),
			prisma.nftContract.count(),
		])

		const totalPages = Math.ceil(total / pageSize)
		const nextPage = pageNumber < totalPages ? pageNumber + 1 : null
		const prevPage = pageNumber > 1 ? pageNumber - 1 : null

		const result: PaginationResult<nftContract> = {
			data: results,
			total,
			totalPages,
			nextPage,
			prevPage,
		}
		const response: BaseResponse = {
			code: 200,
			msg: 'success',
			data: result,
		}
		res.json(response)
	}
)

const getNftInfo = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const { contractAddress } = req.params
		const nftContract = await prisma.nftContract.findUnique({
			where: {
				contract_addr: contractAddress,
			},
		})
		const response: BaseResponse = {
			code: 200,
			msg: 'success',
			data: nftContract,
		}
		res.json(response)
	}
)
export default { getNftList, getNftInfo }
