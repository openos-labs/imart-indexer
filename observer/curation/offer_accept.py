from typing import List, Tuple
from observer.observer import Observer
from model.curation.offer_accept_event import OfferAcceptEvent, OfferAcceptEventData
from model.state import State
from model.event import Event
from common.db import prisma_client
from prisma import enums


class OfferAcceptEventObserver(Observer[OfferAcceptEvent]):

    async def process_all(self, state: State, events: List[Event[OfferAcceptEvent]]) -> State:
        return await super().process_all(state, events)

    async def process(self, state: State, event: Event[OfferAcceptEvent]) -> Tuple[State, bool]:
        new_state = state
        seqno = event.sequence_number
        data = OfferAcceptEventData(**event.data)

        async with prisma_client.tx(timeout=60000) as transaction:
            result = await transaction.curationoffer.update(
                where={'id': data.id},
                data={
                    'status':  enums.CurationOfferStatus.accepted
                }
            )
            if result == None or result.status != enums.CurationOfferStatus.accepted:
                raise Exception(
                    f'[Invitee accept offer]: Failed to accept curation offer({data})')

            updated_offset = await transaction.eventoffset.update(
                where={'id': 0},
                data={
                    "curation_offer_accept_excuted_offset": int(seqno)
                }
            )
            if updated_offset == None:
                raise Exception(
                    f'[Invitee accept Offer]: Failed to update offset')

            new_state.new_offset.curation_offer_accept_excuted_offset = updated_offset.curation_offer_accept_excuted_offset
            return new_state, True
