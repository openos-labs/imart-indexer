from datetime import datetime
from typing import List, Tuple
from observer.observer import Observer
from model.curation.exhibit_redeem_event import ExhibitRedeemEvent, ExhibitRedeemEventData
from model.state import State
from model.event import Event
from common.db import prisma_client
from prisma import enums
from config import config

class ExhibitRedeemEventObserver(Observer[ExhibitRedeemEvent]):

    async def process_all(self, state: State, events: List[Event[ExhibitRedeemEvent]]) -> State:
        return await super().process_all(state, events)

    async def process(self, state: State, event: Event[ExhibitRedeemEvent]) -> Tuple[State, bool]:
        new_state = state
        seqno = event.sequence_number
        data = ExhibitRedeemEventData(**event.data)
        updated_at = datetime.fromtimestamp(int(data.timestamp))
        async with prisma_client.tx(timeout=60000) as transaction:
            result = await transaction.curationexhibit.update(
                where={
                    'index_root': {
                        'index': int(data.id),
                        'root': config.curation.address()
                    }
                },
                data={
                    'status': enums.CurationExhibitStatus.redeemed,
                    'updatedAt': updated_at
                }
            )
            if result == None or result.status != enums.CurationExhibitStatus.redeemed:
                raise Exception(
                    f'[Owner redeem exhibit]: Failed to redeem exhibit({data})')

            updated_offset = await transaction.eventoffset.update(
                where={'id': 0},
                data={
                    "exhibit_redeem_excuted_offset": int(seqno)
                }
            )
            if updated_offset == None:
                raise Exception(
                    f'[Owner redeem exhibit]: Failed to update offset')

            new_state.new_offset.exhibit_redeem_excuted_offset = updated_offset.exhibit_redeem_excuted_offset
            return new_state, True
