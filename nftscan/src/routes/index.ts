/** source/routes/posts.ts */
import express from 'express'
import nftContract from '../controllers/nftContract'

const router = express.Router()

router.get('/api/v1/nft/list', nftContract.getNftList)
router.get('/api/v1/nft/:contractAddress', nftContract.getNftInfo)

export = router
