from prisma import Prisma

prisma_client = Prisma()

async def connect_db():
    await prisma_client.connect()