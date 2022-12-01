from typing import List, Tuple
from model.coin_type_info import CoinTypeInfo
from model.token_id import TokenId, TokenDataId
from observer.observer import Observer
from model.order.list_event import ListEvent, ListEventData
from model.state import State
from model.event import Event
from common.db import prisma_client
from prisma import enums
from datetime import datetime
from common.util import new_uuid


class ListEventObserver(Observer[ListEvent]):

    async def process_all(self, state: State, events: List[Event[ListEvent]]) -> State:
        return await super().process_all(state, events)

    async def process(self, state: State, event: Event[ListEvent]) -> Tuple[State, bool]:
        new_state = state
        seqno = int(event.sequence_number)
        data = ListEventData(**event.data)
        token_data_id = TokenDataId(**TokenId(**data.token_id).token_data_id)
        coin_type_info = CoinTypeInfo(**data.coin_type_info)

        token = await prisma_client.aptostoken.find_first(where={
            'name': token_data_id.name,
            'creator': token_data_id.creator,
            'collection': token_data_id.collection,
        })
        if token == None:
            raise Exception(
                f'[List Order]: Token ({token_data_id}) not found but the list event({data}) was existed.')

        async with prisma_client.tx(timeout=60000) as transaction:
            create_time = datetime.fromtimestamp(
                float(data.timestamp) / 1000000)
            result = await transaction.aptosorder.create(
                data={
                    'id': new_uuid(),
                    'collectionId': token.collectionId,
                    'tokenId': token.id,
                    'price': float(data.price),
                    'orderIndex': data.offer_id,
                    'seller': data.seller,
                    'buyer': "",
                    'currency': coin_type_info.currency(),
                    'status': enums.OrderStatus.LISTING,
                    'createTime': create_time
                }
            )
            if result == None or result.status != enums.OrderStatus.LISTING:
                raise Exception(
                    f"[List Order]: Failed to create new order with list event({data})")

            updated_offset = await transaction.eventoffset.update(
                where={'id': 0},
                data={
                    "list_event_excuted_offset": seqno
                }
            )
            if updated_offset == None or updated_offset.list_event_excuted_offset != seqno:
                raise Exception(f"[List Order]: Failed to update offset")

            new_state.new_offset.list_events_excuted_offset = updated_offset.list_event_excuted_offset
        return new_state, True
