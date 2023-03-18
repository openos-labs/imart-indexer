from datetime import datetime
from typing import List, Tuple
from common.util import new_uuid
from model.token_id import TokenDataId, TokenId
from observer.observer import Observer
from model.curation.exhibit_list_event import ExhibitListEvent, ExhibitListEventData
from model.state import State
from model.event import Event
from common.db import prisma_client
from prisma import enums
from config import config


class ExhibitListEventObserver(Observer[ExhibitListEvent]):

    async def process_all(self, state: State, events: List[Event[ExhibitListEvent]]) -> State:
        return await super().process_all(state, events)

    async def process(self, state: State, event: Event[ExhibitListEvent]) -> Tuple[State, bool]:
        new_state = state
        seqno = event.sequence_number
        data = ExhibitListEventData(**event.data)
        gallery_index = int(data.gallery_id)
        token_id = TokenId(**data.token_id)
        token_data_id = TokenDataId(**token_id.token_data_id)
        updated_at = datetime.fromtimestamp(int(data.timestamp))

        async with prisma_client.tx(timeout=60000) as transaction:
            result = await transaction.curationexhibit.upsert(
                where={
                    'index_root': {
                        'index': int(data.id),
                        'root': config.curation.address()
                    }
                },
                data={
                    'create': {
                        'id': new_uuid(),
                        'chain': enums.Chain.APTOS,
                        'index': int(data.id),
                        'root': config.curation.address(),
                        'galleryIndex': gallery_index,
                        'curator':  data.origin,
                        'collectionIdentifier': token_data_id.collection,
                        'tokenIdentifier': token_data_id.name,
                        'tokenCreator': token_data_id.creator,
                        'propertyVersion': int(token_id.property_version),
                        'origin': data.origin,
                        'price': data.price,
                        'currency': '0x1::aptos_coin::AptosCoin',
                        'decimals': 8,
                        'expiredAt': datetime.fromtimestamp(0),
                        'location': "",
                        'url': "",
                        'detail': "",
                        'status': enums.CurationExhibitStatus.listing,
                        'updatedAt': updated_at
                    },
                    'update': {
                        'chain': enums.Chain.APTOS,
                        'galleryIndex': gallery_index,
                        'curator':  data.origin,
                        'collectionIdentifier': token_data_id.collection,
                        'tokenIdentifier': token_data_id.name,
                        'tokenCreator': token_data_id.creator,
                        'propertyVersion': int(token_id.property_version),
                        'origin': data.origin,
                        'price': data.price,
                        'currency': '0x1::aptos_coin::AptosCoin',
                        'decimals': 8,
                        'expiredAt': datetime.fromtimestamp(0),
                        'location': "",
                        'url': "",
                        'detail': "",
                        'status': enums.CurationExhibitStatus.listing,
                        'updatedAt': updated_at
                    }
                }
            )
            if result == None or result.status != enums.CurationExhibitStatus.listing:
                raise Exception(
                    f'[Curator list exhibit]: Failed to list exhibit({data})')

            updated_offset = await transaction.eventoffset.update(
                where={'id': 0},
                data={
                    "exhibit_list_excuted_offset": int(seqno)
                }
            )
            if updated_offset == None:
                raise Exception(
                    f'[Curator list exhibit]: Failed to update offset')

            new_state.new_offset.exhibit_list_excuted_offset = updated_offset.exhibit_list_excuted_offset
            return new_state, True
