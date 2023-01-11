from typing import List, Tuple
from observer.observer import Observer
from model.curation.offer_create_event import OfferCreateEvent, OfferCreateEventData
from model.state import State
from model.event import Event
from common.db import prisma_client
from prisma import enums
from datetime import datetime


class OfferCreateEventObserver(Observer[OfferCreateEvent]):

    async def process_all(self, state: State, events: List[Event[OfferCreateEvent]]) -> State:
        return await super().process_all(state, events)

    async def process(self, state: State, event: Event[OfferCreateEvent]) -> Tuple[State, bool]:
        new_state = state
        seqno = event.sequence_number
        data = OfferCreateEventData(**event.data)
        offer_start_at = datetime.fromtimestamp(int(data.offer_start_at))
        offer_expired_at = datetime.fromtimestamp(int(data.offer_expired_at))
        exhibit_duration = int(data.exhibit_duration)
        commission_feerate = float(
            data.commission_feerate_numerator) / float(data.commission_feerate_denominator)

        async with prisma_client.tx(timeout=60000) as transaction:
            result = await transaction.curationoffer.upsert(
                where={'id': data.id},
                data={
                    'create': {
                        'id': data.id,
                        'galleryId': data.gallery_id,
                        'collection': data.token_id.token_data_id.collection,
                        'tokenName': data.token_id.token_data_id.name,
                        'tokenCreator': data.token_id.token_data_id.creator,
                        'propertyVersion': 0,
                        'source': data.source,
                        'destination': data.destination,
                        'price': data.price,
                        'commissionFeeRate': commission_feerate,
                        'offerStartAt': offer_start_at,
                        'offerExpiredAt': offer_expired_at,
                        'exhibitDuration': exhibit_duration,
                        'status': enums.CurationOfferStatus.pending,
                    }
                }
            )
            if result == None or result.status != enums.CurationOfferStatus.pending:
                raise Exception(
                    f'[Curator send offer]: Failed to create curation offer({data})')

            updated_offset = await transaction.eventoffset.update(
                where={'id': 0},
                data={
                    "curation_offer_create_excuted_offset": int(seqno)
                }
            )
            if updated_offset == None:
                raise Exception(
                    f'[Curator send Offer]: Failed to update offset')

            new_state.new_offset.curation_offer_create_excuted_offset = updated_offset.curation_offer_create_excuted_offset
            return new_state, True
