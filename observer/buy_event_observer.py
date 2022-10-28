import logging
from typing import List, Tuple
from model.token_id import TokenId, TokenDataId
from observer.observer import Observer
from model.buy_event import BuyEvent, BuyEventData
from model.state import State
from model.event import Event
from common.db import prisma_client
from prisma import enums


class BuyEventObserver(Observer[BuyEvent]):

    async def process_all(self, state: State, events: List[Event[BuyEvent]]) -> State:
        return await super().process_all(state, events)

    async def process(self, state: State, event: Event[BuyEvent]) -> Tuple[State, bool]:
        new_state = state
        seqno = event.sequence_number
        data = BuyEventData(**event.data)
        token_data_id = TokenDataId(**TokenId(**data.token_id).token_data_id)

        token = await prisma_client.aptostoken.find_first(where={
            'name': token_data_id.name,
            'creator': token_data_id.creator,
            'collection': token_data_id.collection,
        })

        if not token == None:
            async with prisma_client.tx(timeout=60000) as transaction:
                result = await transaction.aptosorder.update(
                    where={
                        'tokenId_orderIndex': {
                            'orderIndex': data.offer_id,
                            'tokenId': token.id
                        }
                    },
                    data={
                        'buyer': data.buyer,
                        'status': enums.OrderStatus.SOLD,
                    }
                )
                if result is not None and result.status == enums.OrderStatus.SOLD:
                    await transaction.eventoffset.update(
                        where={'id': 0},
                        data={
                            "buy_event_excuted_offset": int(seqno)
                        }
                    )
            new_state.new_offset.buy_events_excuted_offset = int(seqno)
            return new_state, True
        logging.error(
            f'Token ({token_data_id}) not found but the order ({data.offer_id}) was existed.')
        return new_state, False
