from datetime import datetime
import json
from typing import List, Tuple
from common.util import new_uuid
from common.redis import redis_cli
from model.token_id import TokenId, TokenDataId
from observer.observer import Observer
from model.order.buy_event import BuyEvent, BuyEventData
from model.state import State
from model.event import Event
from common.db import prisma_client
from prisma import enums, Json
from copy import deepcopy


class BuyEventObserver(Observer[BuyEvent]):

    async def process_all(self, state: State, events: List[Event[BuyEvent]]) -> State:
        return await super().process_all(state, events)

    async def process(self, state: State, event: Event[BuyEvent]) -> Tuple[State, bool]:
        new_state = state
        seqno = event.sequence_number
        data = BuyEventData(**event.data)
        token_id = TokenId(**data.token_id)
        token_data_id = TokenDataId(**TokenId(**data.token_id).token_data_id)

        token = await prisma_client.aptostoken.find_first(where={
            'name': token_data_id.name,
            'creator': token_data_id.creator,
            'collection': token_data_id.collection,
        })

        if token == None:
            raise Exception(
                f'[Buy order]: Token ({token_data_id}) not found but the order ({data}) was existed.')

        async with prisma_client.tx(timeout=60000) as transaction:
            # order
            timestamp = datetime.fromtimestamp(
                float(data.timestamp) / 1000000)
            updated = await transaction.aptosorder.update_many(
                where={
                    'status': enums.OrderStatus.LISTING,
                    'tokenId': token.id
                },
                data={
                    'buyer': data.buyer,
                    'status': enums.OrderStatus.SOLD,
                }
            )
            if updated == None:
                raise Exception(
                    f"[Buy order]: Failed to update order status to SOLD")

            # token
            updated = await transaction.aptostoken.update(
                where={
                    "id": token.id
                },
                data={
                    'owner': data.buyer
                }
            )
            if updated == None:
                raise Exception(
                    f"[Buy order]: Failed to update token owner to buyer")

            # activity
            result = await transaction.aptosactivity.create(
                data={
                    'id': new_uuid(),
                    'orderId': "",
                    'collectionId': token.collectionId,
                    'tokenId': token.id,
                    'source': data.seller,
                    'destination': data.buyer,
                    'txHash': f'{event.version}',
                    'txType': enums.TxType.SALE,
                    'quantity': data.token_amount,
                    'price': data.coin_amount,
                    'txTimestamp': timestamp
                }
            )
            if result == None or result.txType != enums.TxType.SALE:
                raise Exception(
                    f"[Token Activity]: Failed to create new activity with buy event")

            # seqno
            updated_offset = await transaction.eventoffset.update(
                where={'id': 0},
                data={
                    "buy_event_excuted_offset": int(seqno)
                }
            )
            if updated_offset == None or updated_offset.buy_event_excuted_offset != int(seqno):
                raise Exception(f"[Buy order]: Failed to update offset")

            new_state.new_offset.buy_events_excuted_offset = updated_offset.buy_event_excuted_offset

            # delete cache
            redis_cli.delete(f"cache:imart:aptosOrder:id:{token.id}")
            redis_cli.delete(f"cache:imart:aptosToken:id:{token.id}")
            redis_cli.delete(
                f"cache:imart:collectionstats:id:{token.collectionId}")

            notification = {
                'id': new_uuid(),
                'receiver': data.seller,
                'title': "Your order has been filled",
                'content': "From IMart",
                'image': "",
                'type': enums.NotificationType.MarketOrderFilled,
                'unread': True,
                'timestamp': timestamp,
                'detail': Json({"name": token_data_id.name, "collection": token_data_id.collection, "creator": token_data_id.creator, "propertyVersion": token_id.property_version})
            }
            data = deepcopy(notification)
            data['timestamp'] = int(timestamp.timestamp() * 1000)
            redis_cli.lpush(
                f"imart:notifications:{data.seller.lower()}",
                json.dumps(data, indent=4, sort_keys=True, default=str)
            )
            await transaction.notification.upsert(
                where={
                    'receiver_type_timestamp': {
                        'receiver': data.seller,
                        'type': enums.NotificationType.MarketOrderFilled,
                        'timestamp': timestamp
                    }
                },
                data={
                    'create': notification,
                    'update': {
                        'receiver': data.seller,
                        'title': "Your order has been filled",
                        'content': "From IMart",
                        'image': "",
                        'type': enums.NotificationType.MarketOrderFilled,
                        'unread': True,
                        'timestamp': timestamp,
                        'detail': Json({"chain": "APTOS", "name": token_data_id.name, "collection": token_data_id.collection, "creator": token_data_id.creator, "propertyVersion": token_id.property_version})
                    }
                }
            )
            return new_state, True
