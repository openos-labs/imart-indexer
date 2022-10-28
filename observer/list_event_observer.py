import logging
from typing import List, Tuple
from model.coin_type_info import CoinTypeInfo
from model.token_id import TokenId, TokenDataId
from observer.observer import Observer
from model.list_event import ListEvent, ListEventData
from model.state import State
from model.event import Event
from common.db import prisma_client
from prisma import enums
from datetime import datetime
from prisma.fields import Base64
from common.util import new_uuid_hex_bytes


class ListEventObserver(Observer[ListEvent]):

    async def process_all(self, state: State, events: List[Event[ListEvent]]) -> State:
        return await super().process_all(state, events)

    async def process(self, state: State, event: Event[ListEvent]) -> Tuple[State, bool]:
        new_state = state
        seqno = event.sequence_number
        data = ListEventData(**event.data)
        token_data_id = TokenDataId(**TokenId(**data.token_id).token_data_id)
        coin_type_info = CoinTypeInfo(**data.coin_type_info)

        token = await prisma_client.aptostoken.find_first(where={
            'name': token_data_id.name,
            'creator': token_data_id.creator,
            'collection': token_data_id.collection,
        })
        if not token == None:
            async with prisma_client.tx(timeout=60000) as transaction:
                create_time = datetime.fromtimestamp(
                    int(data.timestamp) // 1000000)
                id = new_uuid_hex_bytes()
                result = await transaction.aptosorder.create(
                    data={
                        'id': Base64.encode(id),
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
                if result is not None and result.status == enums.OrderStatus.LISTING:
                    await transaction.eventoffset.update(
                        where={'id': 0},
                        data={
                            "list_event_excuted_offset": int(seqno)
                        }
                    )
            new_state.new_offset.list_events_excuted_offset = int(seqno)
            return new_state, True
        logging.error(
            f'Token ({token_data_id}) not found but the order ({data.offer_id}) was existed.')
        return new_state, False
