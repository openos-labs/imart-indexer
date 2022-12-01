
import asyncio
import json
import logging
from prisma import enums
from common.db import connect_db, prisma_client


async def main():
    await connect_db()
    with open("./testdata/collections.json", 'r') as jsonfile:
        text = jsonfile.read()
        data = json.loads(text)
        for item in data['data']:
            await prisma_client.collection.upsert(
                where={
                    "chain_creator_name": {
                        'chain': enums.Chain.APTOS,
                        'creator': item['creator'],
                        'name': item['name']
                    }
                },
                data={
                    'create': {
                        'rawCollectionId': '',
                        'chain': enums.Chain.APTOS,
                        'metadataType': enums.MetadataType.IMAGE,
                        'category': '',
                        'contractName': '',
                        'name': item['collection'],
                        'creator': item['creator'],
                        'description': item['description'],
                        'supply': int(item['supply']),
                        'floorPrice': item['floor_price'],
                        'volume': item['total_volume'],
                        'cover': item['cover_uri'],
                        'uri': item['cover_uri']
                    },
                    'update': {
                        'rawCollectionId': '',
                        'chain': enums.Chain.APTOS,
                        'metadataType': enums.MetadataType.IMAGE,
                        'category': '',
                        'contractName': '',
                        'name': item['collection'],
                        'creator': item['creator'],
                        'description': item['description'],
                        'supply': int(item['supply']),
                        'floorPrice': item['floor_price'],
                        'volume': item['total_volume'],
                        'cover': item['cover_uri'],
                        'uri': item['cover_uri']
                    }
                })


if __name__ == "__main__":
    logging.basicConfig(
        filename='collection_from_json.log', level=logging.ERROR)
    asyncio.run(main())
