import redis
from config import config
redis_cli = redis.Redis.from_url(config.redis_url)
