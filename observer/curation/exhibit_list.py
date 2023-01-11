from datetime import datetime
from typing import List, Tuple
from observer.observer import Observer
from model.curation.exhibit_list_event import ExhibitListEvent, ExhibitListEventData
from model.state import State
from model.event import Event
from model.token_id import TokenDataId, TokenId
from common.db import prisma_client
from prisma import enums
from config import config
from common.util import new_uuid


class ExhibitListEventObserver(Observer[ExhibitListEvent]):

    async def process_all(self, state: State, events: List[Event[ExhibitListEvent]]) -> State:
        return await super().process_all(state, events)

    async def process(self, state: State, event: Event[ExhibitListEvent]) -> Tuple[State, bool]:
        new_state = state
        seqno = event.sequence_number
        data = ExhibitListEventData(**event.data)
        index = int(data.id)
        token_id = TokenId(**data.token_id)
        token_data_id = TokenDataId(**token_id.token_data_id)
        expired_at = datetime.timestamp(data.expiration)
        commission_feerate = str(10**8 *
                                 int(data.commission_feerate_numerator) //
                                 int(data.commission_feerate_denominator))

        async with prisma_client.tx(timeout=60000) as transaction:
            result = await transaction.curationexhibit.upsert(
                where={
                    'index_root': {
                        'index': index,
                        'root': config.curation.address()
                    }
                },
                data={
                    'create': {
                        'id': new_uuid(),
                        'index': index,
                        'root': config.curation.address(),
                        'galleryIndex': data.gallery_id,
                        'collection': token_data_id.collection,
                        'tokenName': token_data_id.name,
                        'tokenCreator': token_data_id.creator,
                        'propertyVersion': int(token_id.property_version),
                        'origin': data.origin,
                        'price': data.price,
                        'commissionFeeRate': commission_feerate,
                        'expiredAt': expired_at,
                        'location': data.location,
                        'url': data.url,
                        'detail': data.detail,
                        'status': enums.CurationExhibitStatus.listing
                    },
                    'update': {
                        'galleryIndex': data.gallery_id,
                        'collection': token_data_id.collection,
                        'tokenName': token_data_id.name,
                        'tokenCreator': token_data_id.creator,
                        'propertyVersion': int(token_id.property_version),
                        'origin': data.origin,
                        'price': data.price,
                        'commissionFeeRate': commission_feerate,
                        'expiredAt': expired_at,
                        'location': data.location,
                        'url': data.url,
                        'detail': data.detail,
                        'status': enums.CurationExhibitStatus.listing
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
