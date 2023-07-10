import * as env from 'dotenv'
import { createClient } from '@redis/client'
env.config()

const redis = createClient({ url: process.env.REDIS_URL })
export { redis }
