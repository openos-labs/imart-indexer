from typing import List, Tuple
from aptos.common.util import primary_key_of_collection
from observer.observer import Observer
from model.creation.create_collection_event import CreateCollectionEvent, CreateCollectionEventData
from model.state import State
from model.event import Event
from common.db import prisma_client
from prisma import enums, Json


class CreateCollectionEventObserver(Observer[CreateCollectionEvent]):

    async def process_all(self, state: State, events: List[Event[CreateCollectionEvent]]) -> State:
        return await super().process_all(state, events)

    async def process(self, state: State, event: Event[CreateCollectionEvent]) -> Tuple[State, bool]:
        new_state = state
        seqno = event.sequence_number
        data = CreateCollectionEventData(**event.data)
        async with prisma_client.tx(timeout=60000) as transaction:
            result = await prisma_client.collection.upsert(
                where={
                    'chain_creator_name': {
                        'chain': enums.Chain.APTOS,
                        'creator': data.creator,
                        'name': data.name,
                    },
                },
                data={
                    'create': {
                        'id': primary_key_of_collection('', data.creator, data.name),
                        'chain': enums.Chain.APTOS,
                        'metadataType': enums.MetadataType.OTHER,
                        'category': data.category,
                        'tags': ','.join(data.tags),
                        'contractName': "",
                        'contract': "",
                        'name': data.name,
                        'creator': data.creator,
                        'description': data.description,
                        'cover': '',
                        'logo': '',
                        'maximum': data.maximum,
                        'volume': '',
                        'floorPrice': '',
                        'uri': data.uri,
                        'supply': '0',
                        'royalty': Json(dict(zip(data.payees, data.royalties))),
                    },
                    'update': {}
                })

            if result == None:
                raise Exception(
                    f'[Create collection]: Failed to create new collection({data})')

            updated_offset = await transaction.eventoffset.update(
                where={'id': 0},
                data={
                    "creation_collection_created_excuted_offset": int(seqno)
                }
            )
            if updated_offset == None:
                raise Exception(
                    f'[Create collection]: Failed to update offset')

            new_state.new_offset.creation_collection_created_excuted_offset = updated_offset.creation_collection_created_excuted_offset
            return new_state, True
