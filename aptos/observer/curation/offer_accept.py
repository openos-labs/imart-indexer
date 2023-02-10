from datetime import datetime
from typing import List, Tuple
from common.util import new_uuid
from model.token_id import TokenDataId, TokenId
from observer.observer import Observer
from model.curation.offer_accept_event import OfferAcceptEvent, OfferAcceptEventData
from model.state import State
from model.event import Event
from common.db import prisma_client
from prisma import enums, Json
from config import config


class OfferAcceptEventObserver(Observer[OfferAcceptEvent]):

    async def process_all(self, state: State, events: List[Event[OfferAcceptEvent]]) -> State:
        return await super().process_all(state, events)

    async def process(self, state: State, event: Event[OfferAcceptEvent]) -> Tuple[State, bool]:
        new_state = state
        seqno = event.sequence_number
        data = OfferAcceptEventData(**event.data)
        index = int(data.id)
        gallery_index = int(data.gallery_id)
        token_id = TokenId(**data.token_id)
        token_data_id = TokenDataId(**token_id.token_data_id)
        expired_at = datetime.fromtimestamp(int(data.exhibit_duration))
        updated_at = datetime.fromtimestamp(int(data.timestamp))
        commission_feerate = str(10**8 *
                                 int(data.commission_feerate_numerator) //
                                 int(data.commission_feerate_denominator))

        async with prisma_client.tx(timeout=60000) as transaction:
            updated_offer = await transaction.curationoffer.update(
                where={
                    'index_root': {
                        'index': int(data.id),
                        'root': config.curation.address()
                    }
                },
                data={
                    'status':  enums.CurationOfferStatus.accepted,
                    'updatedAt': updated_at
                }
            )
            if updated_offer == None or updated_offer.status != enums.CurationOfferStatus.accepted:
                raise Exception(
                    f'[Invitee accept offer]: Failed to accept curation offer({data})')

            result = await transaction.curationexhibit.upsert(
                where={
                    'index_root': {
                        'index': index,
                        'root': config.curation.address()
                    }
                },
                data={
                    'create': {
                        'id': new_uuid(),
                        'chain': enums.Chain.APTOS,
                        'index': index,
                        'root': config.curation.address(),
                        'galleryIndex': gallery_index,
                        'curator':  updated_offer.source,
                        'collection': token_data_id.collection,
                        'tokenName': token_data_id.name,
                        'tokenCreator': token_data_id.creator,
                        'propertyVersion': int(token_id.property_version),
                        'origin': data.destination,
                        'price': data.price,
                        'commissionFeeRate': commission_feerate,
                        'currency': '0x1::aptos_coin::AptosCoin',
                        'decimals': 8,
                        'expiredAt': expired_at,
                        'location': "",
                        'url': updated_offer.url,
                        'detail': updated_offer.detail,
                        'status': enums.CurationExhibitStatus.reserved,
                        'updatedAt': updated_at
                    },
                    'update': {
                        'chain': enums.Chain.APTOS,
                        'galleryIndex': gallery_index,
                        'collection': token_data_id.collection,
                        'tokenName': token_data_id.name,
                        'tokenCreator': token_data_id.creator,
                        'propertyVersion': int(token_id.property_version),
                        'origin': data.destination,
                        'price': data.price,
                        'commissionFeeRate': commission_feerate,
                        'currency': '0x1::aptos_coin::AptosCoin',
                        'decimals': 8,
                        'expiredAt': expired_at,
                        'location': "",
                        'url': updated_offer.url,
                        'detail': updated_offer.detail,
                        'status': enums.CurationExhibitStatus.reserved,
                        'updatedAt': updated_at
                    }
                }
            )
            if result == None or result.status != enums.CurationExhibitStatus.reserved:
                raise Exception(
                    f'[Invitee accept offer]: Failed to reserve exhibit({data})')

            updated_offset = await transaction.eventoffset.update(
                where={'id': 0},
                data={
                    "curation_offer_accept_excuted_offset": int(seqno)
                }
            )
            if updated_offset == None:
                raise Exception(
                    f'[Invitee accept offer]: Failed to update offset')

            await transaction.notification.upsert(
                where={
                    'receiver_type_timestamp': {
                        'receiver': data.source,
                        'type': enums.NotificationType.CurationOfferAccepted,
                        'timestamp': updated_at
                    }
                },
                data={
                    'create': {
                        'id': new_uuid(),
                        'receiver': data.source,
                        'title': "Your offer has been accepted",
                        'content': "From IMart",
                        'image': "",
                        'type': enums.NotificationType.CurationOfferAccepted,
                        'unread': True,
                        'timestamp': updated_at,
                        'detail': Json({"chain": "APTOS", "name": token_data_id.name, "collection": token_data_id.collection, "creator": token_data_id.creator, "propertyVersion": token_id.property_version})
                    },
                    'update': {
                        'receiver': data.source,
                        'title': "Your offer has been accepted",
                        'content': "From IMart",
                        'image': "",
                        'type': enums.NotificationType.CurationOfferAccepted,
                        'unread': True,
                        'timestamp': updated_at,
                        'detail': Json({"chain": "APTOS", "name": token_data_id.name, "collection": token_data_id.collection, "creator": token_data_id.creator, "propertyVersion": token_id.property_version})
                    }
                }
            )

            new_state.new_offset.curation_offer_accept_excuted_offset = updated_offset.curation_offer_accept_excuted_offset
            return new_state, True
