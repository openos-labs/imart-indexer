from typing import List, Tuple
from observer.observer import Observer
from model.curation.exhibit_buy_event import ExhibitBuyEvent, ExhibitBuyEventData
from model.state import State
from model.event import Event
from common.db import prisma_client
from prisma import enums


class ExhibitBuyEventObserver(Observer[ExhibitBuyEvent]):

    async def process_all(self, state: State, events: List[Event[ExhibitBuyEvent]]) -> State:
        return await super().process_all(state, events)

    async def process(self, state: State, event: Event[ExhibitBuyEvent]) -> Tuple[State, bool]:
        new_state = state
        seqno = event.sequence_number
        data = ExhibitBuyEventData(**event.data)

        async with prisma_client.tx(timeout=60000) as transaction:
            result = await transaction.curationexhibit.update(
                where={'id': data.id},
                data={
                    'status': enums.CurationExhibitStatus.sold
                }
            )
            if result == None or result.status != enums.CurationExhibitStatus.sold:
                raise Exception(
                    f'[Visitor buy exhibit]: Failed to buy exhibit({data})')

            updated_offset = await transaction.eventoffset.update(
                where={'id': 0},
                data={
                    "exhibit_buy_excuted_offset": int(seqno)
                }
            )
            if updated_offset == None:
                raise Exception(
                    f'[Visitor buy exhibit]: Failed to update offset')

            new_state.new_offset.exhibit_buy_excuted_offset = updated_offset.exhibit_buy_excuted_offset
            return new_state, True
