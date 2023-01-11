from typing import List, Tuple
from observer.observer import Observer
from model.curation.exhibit_freeze_event import ExhibitFreezeEvent, ExhibitFreezeEventData
from model.state import State
from model.event import Event
from common.db import prisma_client
from prisma import enums


class ExhibitFreezeEventObserver(Observer[ExhibitFreezeEvent]):

    async def process_all(self, state: State, events: List[Event[ExhibitFreezeEvent]]) -> State:
        return await super().process_all(state, events)

    async def process(self, state: State, event: Event[ExhibitFreezeEvent]) -> Tuple[State, bool]:
        new_state = state
        seqno = event.sequence_number
        data = ExhibitFreezeEventData(**event.data)

        async with prisma_client.tx(timeout=60000) as transaction:
            result = await transaction.curationexhibit.update(
                where={'id': data.id},
                data={
                    'status': enums.CurationExhibitStatus.frozen
                }
            )
            if result == None or result.status != enums.CurationExhibitStatus.frozen:
                raise Exception(
                    f'[System freeze exhibit]: Failed to freeze exhibit({data})')

            updated_offset = await transaction.eventoffset.update(
                where={'id': 0},
                data={
                    "exhibit_freeze_excuted_offset": int(seqno)
                }
            )
            if updated_offset == None:
                raise Exception(
                    f'[System freeze exhibit]: Failed to update offset')

            new_state.new_offset.exhibit_freeze_excuted_offset = updated_offset.exhibit_freeze_excuted_offset
            return new_state, True
