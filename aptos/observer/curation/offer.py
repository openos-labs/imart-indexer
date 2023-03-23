import json
from typing import List, Tuple
from observer.observer import Observer
from model.curation.offer_event import OfferEvent, OfferEventData
from model.state import State
from model.event import Event
from model.token_id import TokenDataId, TokenId
from common.db import prisma_client
from prisma import enums, Json
from datetime import datetime
from common.util import new_uuid
from common.redis import redis_cli
from config import config

event_type_to_status = {
    'OfferCreated': enums.CurationOfferStatus.pending,
    'OfferRejected': enums.CurationOfferStatus.rejected,
    "OfferAccepted": enums.CurationOfferStatus.accepted,
    "OfferCanceled": enums.CurationOfferStatus.canceled
}


class CurationOfferEventObserver(Observer[OfferEvent]):

    async def process_all(self, state: State, events: List[Event[OfferEvent]]) -> State:
        return await super().process_all(state, events)

    async def process(self, state: State, event: Event[OfferEvent]) -> Tuple[State, bool]:
        new_state = state
        seqno = event.sequence_number
        data = OfferEventData(**event.data)
        index = int(data.id)
        gallery_index = int(data.gallery_id)
        token_id = TokenId(**data.token_id)
        event_type = data.event_type
        token_data_id = TokenDataId(**token_id.token_data_id)
        updated_at = datetime.fromtimestamp(int(data.timestamp))
        offer_start_at = datetime.fromtimestamp(int(data.offer_start_at))
        offer_expired_at = datetime.fromtimestamp(int(data.offer_expired_at))
        exhibit_expired_at = int(data.exhibit_expired_at)

        root = config.curation.address()

        async with prisma_client.tx(timeout=60000) as transaction:
            result = await transaction.curationoffer.upsert(
                where={
                    'index_root': {
                        'index': index,
                        'root': root
                    }
                },
                data={
                    'create': {
                        'id': new_uuid(),
                        'chain': enums.Chain.APTOS,
                        'index': index,
                        'root': root,
                        'galleryIndex': gallery_index,
                        'collectionIdentifier': token_data_id.collection,
                        'tokenIdentifier': token_data_id.name,
                        'tokenCreator': token_data_id.creator,
                        'propertyVersion': 0,
                        'source': data.source,
                        'destination': data.destination,
                        'price': data.price,
                        'currency': '0x1::aptos_coin::AptosCoin',
                        'decimals': 8,
                        'offerStartAt': offer_start_at,
                        'offerExpiredAt': offer_expired_at,
                        'exhibitDuration': exhibit_expired_at,
                        'status': event_type_to_status[event_type],
                        'updatedAt': updated_at,
                        'url': data.url,
                        'detail': data.detail
                    },
                    'update': {
                        'chain': enums.Chain.APTOS,
                        'index': index,
                        'root': root,
                        'galleryIndex': gallery_index,
                        'collectionIdentifier': token_data_id.collection,
                        'tokenIdentifier': token_data_id.name,
                        'tokenCreator': token_data_id.creator,
                        'propertyVersion': 0,
                        'source': data.source,
                        'destination': data.destination,
                        'price': data.price,
                        'currency': '0x1::aptos_coin::AptosCoin',
                        'decimals': 8,
                        'offerStartAt': offer_start_at,
                        'offerExpiredAt': offer_expired_at,
                        'exhibitDuration': exhibit_expired_at,
                        'status': event_type_to_status[event_type],
                        'updatedAt': updated_at,
                        'url': data.url,
                        'detail': data.detail
                    }
                }
            )

            if result == None or result.status != event_type_to_status[event_type]:
                raise Exception(
                    f'[Curator offer]: Failed to update curation offer({data})')

            # token
            updated_token = await transaction.aptostoken.update_many(
                where={
                    'name': token_data_id.name,
                    'creator': token_data_id.creator,
                    'collection': token_data_id.collection,
                },
                data={
                    'owner': data.destination
                }
            )
            if updated_token == None:
                raise Exception(
                    f"[Curator Offer]: Failed to update token owner to curator")

            updated_offset = await transaction.eventoffset.update(
                where={'id': 0},
                data={
                    "curation_offer_excuted_offset": int(seqno)
                }
            )
            if updated_offset == None:
                raise Exception(
                    f'[Curator Offer]: Failed to update offset')

            notification_receiver = ''
            notification_title = ''
            notification_type = ''
            notification_timestamp = datetime.now()
            notification_detail = Json({})
            if event_type == 'OfferCreated':
                notification_receiver = data.destination
                notification_title = "You have received an offer"
                notification_type = enums.NotificationType.CurationOfferReceived
                notification_timestamp = updated_at
                notification_detail = Json(
                    {
                        "chain": "APTOS",
                        "index": gallery_index,
                        "root": root
                    }
                )
            elif event_type == "OfferAccepted":
                notification_receiver = data.source
                notification_title = "Your offer has been accepted"
                notification_type = enums.NotificationType.CurationOfferAccepted
                notification_timestamp = updated_at
                notification_detail = Json(
                    {
                        "chain": "APTOS",
                        "name": token_data_id.name,
                        "collection": token_data_id.collection,
                        "creator": token_data_id.creator,
                        "propertyVersion": token_id.property_version
                    }
                )
            elif event_type == "OfferRejected":
                notification_receiver = data.source
                notification_title = "Your offer has been rejected"
                notification_type = enums.NotificationType.CurationOfferRejected
                notification_timestamp = updated_at
                notification_detail = Json(
                    {
                        "chain": "APTOS",
                        "name": token_data_id.name,
                        "collection": token_data_id.collection,
                        "creator": token_data_id.creator,
                        "propertyVersion": token_id.property_version
                    }
                )

            notification = {
                'id': new_uuid(),
                'receiver': notification_receiver,
                'title': notification_title,
                'content': "From Mixverse",
                'image': "",
                'type': notification_type,
                'unread': True,
                'timestamp': notification_timestamp,
                'detail': notification_detail
            }

            if event_type in ["OfferAccepted", "OfferCreated", "OfferRejected"]:
                redis_cli.lpush(f"imart:notifications:{notification_receiver.lower()}", json.dumps(
                    notification, indent=4, sort_keys=True, default=str))
                await transaction.notification.upsert(
                    where={
                        'receiver_type_timestamp': {
                            'receiver': notification_receiver,
                            'type': notification_type,
                            'timestamp': notification_timestamp
                        }
                    },
                    data={
                        'create': notification,
                        'update': {
                            'receiver': notification_receiver,
                            'title': notification_title,
                            'content': "From Mixverse",
                            'image': "",
                            'type': notification_type,
                            'unread': True,
                            'timestamp': notification_timestamp,
                            'detail': notification_detail
                        }
                    }
                )
            new_state.new_offset.curation_offer_excuted_offset = updated_offset.curation_offer_excuted_offset
            return new_state, True
