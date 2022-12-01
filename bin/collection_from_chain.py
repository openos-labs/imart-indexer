import argparse
import asyncio
import json
import sys
import logging
import aiohttp
from typing import List
from common.db import connect_db, prisma_client
from prisma import enums
from common.util import new_uuid, flatten


class Fetcher:
    def __init__(self, node: str, account: str) -> None:
        self.sema = asyncio.BoundedSemaphore(3)
        self.collection_events_url = f'{node}/accounts/{account}/events/0x3::token::Collections/create_collection_events'
        self.token_data_events_url = f'{node}/accounts/{account}/events/0x3::token::Collections/create_token_data_events'

    async def fetch_page_data_created_events_of(self, i: int) -> List[dict]:
        async with aiohttp.ClientSession() as session:
            limit = 25
            start = limit * i
            async with self.sema, session.get(self.token_data_events_url + f"?limit={limit}&start={start}") as resp:
                if resp.status == 200:
                    data = await resp.json()
                    return data
                return []

    async def fetch_token_data_created_events_of(self, coll: dict) -> List[dict]:
        maximum = 100
        # if not int(coll.maximum) >= sys.maxsize / 2:
        #     maximum = int(coll.maximum)
        count = maximum // 100 + 1
        lists = await asyncio.gather(*[self.fetch_page_data_created_events_of(i, coll) for i in range(count)])
        return flatten(lists)

    async def fetch_collection_created_events_of(self) -> List[dict]:
        async with aiohttp.ClientSession() as session:
            async with self.sema, session.get(self.collection_events_url + "?limit=25") as resp:
                if resp.status == 200:
                    return await resp.json()
                return []


class Dumper:
    def __init__(self) -> None:
        self.sema = asyncio.BoundedSemaphore(5)

    async def dump_collection(self, event: dict) -> any:
        data = event['data']
        uri = data['uri']
        name = data['collection_name']
        creator = data['creator']
        maximum = data['maximum']
        maximum = min(sys.maxsize, int(maximum))
        description = data['description']
        rawCollectionId = {
            "creator": creator,
            "name": name
        }
        try:
            result = await prisma_client.collection.upsert(
                where={
                    "chain_creator_name": {
                        "chain": enums.Chain.APTOS,
                        "creator": creator,
                        "name": name
                    }
                },
                data={
                    'create': {
                        'id': new_uuid(),
                        'rawCollectionId': json.dumps(rawCollectionId),
                        'chain': enums.Chain.APTOS,
                        'metadataType': enums.MetadataType.IMAGE,
                        'category': '',
                        'contractName': name,
                        'name': name,
                        'creator': creator,
                        'description': description,
                        'uri': uri,
                        'floorPrice': None,
                        'maximum': maximum,
                    },
                    'update': {
                        'contractName': name,
                        'name': name,
                        'creator': creator,
                        'description': description,
                        'uri': uri,
                        'maximum': maximum,
                    }
                })
            return result
        except Exception as err:
            logging.error(f'failed to save {event}: {err} ')
            return None

    async def dump_token(self, event: dict) -> bool:
        try:
            seqno = int(event['sequence_number'])
            data = event['data']
            seqno = int(event['sequence_number'])
            uri = data['uri']
            token_id = data['id']
            description = data['description']

            name = token_id['name']
            creator = token_id['creator']
            collection = token_id['collection']

            rawTokenId = {
                'creator': creator,
                'name': name,
                'collection': collection,
                'propertyVersion': '0'
            }
            result = await prisma_client.collection.find_unique(
                where={
                    'chain_creator_name': {
                        'chain': enums.Chain.APTOS,
                        'creator': creator,
                        'name': collection
                    }
                }
            )
            await prisma_client.aptostoken.upsert(
                where={
                    'creator_name_collection_propertyVersion': rawTokenId
                }, data={
                    'create': {
                        'id': new_uuid(),
                        'collectionId': result.id,
                        'rawCollectionId': '',
                        'rawTokenId': '',
                        'collection': collection,
                        'name': name,
                        'creator': creator,
                        'description': "",
                        'uri': uri,
                        'seqno': seqno
                    },
                    'update': {
                        'rawCollectionId': '',
                        'rawTokenId': '',
                        'description': "",
                        'uri': uri,
                        'seqno': seqno
                    }
                })
            return True
        except Exception as err:
            logging.error(f'failed to save {event}: {err}')
            return False

    async def dump_tokens(self, tokens: List[dict]) -> bool:
        await asyncio.gather(*[self.dump_token(token) for token in tokens])


def load_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        prog='CollectionDataGathering',
        description='Gathers collection data from Aptos official node service')
    parser.add_argument('-a', "--account")
    parser.add_argument('-c', "--collection")
    parser.add_argument(
        '--node', default="https://fullnode.testnet.aptoslabs.com/v1")
    return parser.parse_args()


async def main():
    await connect_db()

    node = args.node
    account = args.account
    coll_field = args.collection

    dumper = Dumper()
    fetcher = Fetcher(node, account)

    events = await fetcher.fetch_collection_created_events_of()
    coll_events = []
    if coll_field is not None:
        coll_event = filter(
            lambda x: x['data']['collection_name'] == coll_field, events)
        coll_events.append(coll_event)
    else:
        coll_events.extend(events)

    for coll_event in coll_events:
        await dumper.dump_collection(coll_event)

    i = 0
    while True:
        token_events = await fetcher.fetch_page_data_created_events_of(i)
        if len(token_events) > 0:
            await dumper.dump_tokens(token_events)
            i += 1
        else:
            break

global args
if __name__ == "__main__":
    args = load_args()
    logging.basicConfig(
        filename='collection_from_chain.log', level=logging.ERROR)
    asyncio.run(main())
