from typing import List, Tuple
from model.token_id import TokenDataId, TokenId
from observer.observer import Observer
from model.creation.create_token_event import CreateTokenEvent, CreateTokenEventData
from model.state import State
from model.event import Event
from common.db import prisma_client
from prisma import enums
from common.util import primary_key_of_token


class CreateTokenEventObserver(Observer[CreateTokenEvent]):

    async def process_all(self, state: State, events: List[Event[CreateTokenEvent]]) -> State:
        return await super().process_all(state, events)

    async def process(self, state: State, event: Event[CreateTokenEvent]) -> Tuple[State, bool]:
        new_state = state
        seqno = event.sequence_number
        data = CreateTokenEventData(**event.data)
        token_id = TokenId(**data.token_id)
        token_data_id = TokenDataId(**token_id.token_data_id)
        collection = await prisma_client.collection.find_unique(where={
            'chain_creator_name': {
                'chain': enums.Chain.APTOS,
                'creator': data.creator,
                'name': token_data_id.collection,
            }
        })
        if collection == None:
            raise Exception(
                f'[Create token]: collection not found, but created token event({data}) was existed')

        async with prisma_client.tx(timeout=60000) as transaction:
            id = primary_key_of_token(
                '', data.creator, token_data_id.collection, data.name)
            result = await transaction.aptostoken.upsert(
                where={
                    'id': id
                },
                data={
                    'create': {
                        'id': id,
                        'collectionId': collection.id,
                        'owner': data.creator,
                        'creator': token_data_id.creator,
                        'collection': token_data_id.collection,
                        'name': data.name,
                        'description': data.description,
                        'uri': data.uri,
                        'propertyVersion': token_id.property_version,
                        'seqno': seqno
                    },
                    'update': {}
                }
            )
            if result == None:
                raise Exception(
                    f'[Create token]: Failed to create new token({data})')

            updated_offset = await transaction.eventoffset.update(
                where={'id': 0},
                data={
                    "creation_token_created_excuted_offset": int(seqno)
                }
            )
            if updated_offset == None:
                raise Exception(f'[Create token]: Failed to update offset')

            new_state.new_offset.creation_token_created_excuted_offset = updated_offset.creation_token_created_excuted_offset
            return new_state, True
