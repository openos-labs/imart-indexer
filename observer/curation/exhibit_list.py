from typing import List, Tuple
from observer.observer import Observer
from model.curation.exhibit_list_event import ExhibitListEvent, ExhibitListEventData
from model.state import State
from model.event import Event
from common.db import prisma_client
from prisma import enums


class ExhibitListEventObserver(Observer[ExhibitListEvent]):

    async def process_all(self, state: State, events: List[Event[ExhibitListEvent]]) -> State:
        return await super().process_all(state, events)

    async def process(self, state: State, event: Event[ExhibitListEvent]) -> Tuple[State, bool]:
        new_state = state
        seqno = event.sequence_number
        data = ExhibitListEventData(**event.data)

        async with prisma_client.tx(timeout=60000) as transaction:
            result = await transaction.curationexhibit.upsert(
                where={'id': data.id},
                data={
                    'create': {
                        'id': data.id,
                        'galleryId': data.gallery_id,
                        'collection': data.token_id.token_data_id.collection,
                        'tokenName': data.token_id.token_data_id.name,
                        'tokenCreator': data.token_id.token_data_id.creator,
                        'propertyVersion': 0,
                        'origin': data.origin,
                        'price': data.price,
                        'commissionFeeRate': float(data.commission_feerate_numerator) / float(data.commission_feerate_denominator),
                        'expiredAt': data.expiration,
                        'location': data.location,
                        'url': data.url,
                        'detail': data.detail,
                        'status': enums.CurationExhibitStatus.listing
                    },
                    'update': {
                        'galleryId': data.gallery_id,
                        'collection': data.token_id.token_data_id.collection,
                        'tokenName': data.token_id.token_data_id.name,
                        'tokenCreator': data.token_id.token_data_id.creator,
                        'propertyVersion': 0,
                        'origin': data.origin,
                        'price': data.price,
                        'commissionFeeRate': float(data.commission_feerate_numerator) / float(data.commission_feerate_denominator),
                        'expiredAt': data.expiration,
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
