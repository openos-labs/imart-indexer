import logging
from typing import List, Tuple
from model.token_id import TokenId, TokenDataId
from observer.observer import Observer
from model.delist_event import DelistEvent, DelistEventData
from model.state import State
from model.event import Event
from common.db import prisma_client
from prisma import enums


class DelistEventObserver(Observer[DelistEvent]):

    async def process_all(self, state: State, events: List[Event[DelistEvent]]) -> State:
        return await super().process_all(state, events)

    async def process(self, state: State, event: Event[DelistEvent]) -> Tuple[State, bool]:
        new_state = state
        seqno = int(event.sequence_number)
        data = DelistEventData(**event.data)
        token_data_id = TokenDataId(**TokenId(**data.token_id).token_data_id)

        token = await prisma_client.aptostoken.find_first(where={
            'name': token_data_id.name,
            'creator': token_data_id.creator,
            'collection': token_data_id.collection,
        })

        if not token == None:
            async with prisma_client.tx(timeout=60000) as transaction:
                updated = await transaction.aptosorder.update_many(
                    where={
                        'status': enums.OrderStatus.LISTING,
                        'tokenId': token.id
                    },
                    data={
                        'status': enums.OrderStatus.CANCELED,
                    }
                )
                if updated is not None and updated > 0:
                    await transaction.eventoffset.update(
                        where={'id': 0},
                        data={
                            "delist_event_excuted_offset": seqno
                        }
                    )
            new_state.new_offset.delist_events_excuted_offset = seqno
            return new_state, True
        logging.error(
            f'Token ({token_data_id}) not found but the order ({data.offer_id}) was existed.')
        return new_state, False
