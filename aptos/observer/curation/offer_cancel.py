from datetime import datetime
from typing import List, Tuple
from observer.observer import Observer
from model.curation.offer_cancel_event import OfferCancelEvent, OfferCancelEventData
from model.state import State
from model.event import Event
from common.db import prisma_client
from prisma import enums
from config import config


class OfferCancelEventObserver(Observer[OfferCancelEvent]):

    async def process_all(self, state: State, events: List[Event[OfferCancelEvent]]) -> State:
        return await super().process_all(state, events)

    async def process(self, state: State, event: Event[OfferCancelEvent]) -> Tuple[State, bool]:
        new_state = state
        seqno = event.sequence_number
        data = OfferCancelEventData(**event.data)
        updated_at = datetime.fromtimestamp(int(data.timestamp))

        async with prisma_client.tx(timeout=60000) as transaction:
            result = await transaction.curationoffer.update(
                where={
                    'index_root': {
                        'index': int(data.id),
                        'root': config.curation.address()
                    }
                },
                data={
                    'status':  enums.CurationOfferStatus.canceled,
                    'updatedAt': updated_at
                }
            )
            if result == None or result.status != enums.CurationOfferStatus.canceled:
                raise Exception(
                    f'[Curator cancel offer]: Failed to cancel curation offer({data})')

            updated_offset = await transaction.eventoffset.update(
                where={'id': 0},
                data={
                    "curation_offer_cancel_excuted_offset": int(seqno)
                }
            )
            if updated_offset == None:
                raise Exception(
                    f'[Curation cancel Offer]: Failed to update offset')

            new_state.new_offset.curation_offer_cancel_excuted_offset = updated_offset.curation_offer_cancel_excuted_offset
            return new_state, True
