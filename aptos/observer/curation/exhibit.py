from datetime import datetime
from typing import List, Tuple
from common.util import new_uuid
from model.token_id import TokenDataId, TokenId
from observer.observer import Observer
from model.curation.exhibit_event import ExhibitEvent, ExhibitEventData
from model.state import State
from model.event import Event
from common.db import prisma_client
from prisma import enums
from config import config

event_type_to_status = {
    "ExhibitListed": enums.CurationExhibitStatus.listing,
    "ExhibitFrozen": enums.CurationExhibitStatus.frozen,
    "ExhibitRedeemed": enums.CurationExhibitStatus.redeemed,
    "ExhibitSold": enums.CurationExhibitStatus.sold
}


class ExhibitEventObserver(Observer[ExhibitEvent]):

    async def process_all(self, state: State, events: List[Event[ExhibitEvent]]) -> State:
        return await super().process_all(state, events)

    async def process(self, state: State, event: Event[ExhibitEvent]) -> Tuple[State, bool]:
        new_state = state
        seqno = event.sequence_number
        data = ExhibitEventData(**event.data)
        gallery_index = int(data.gallery_id)
        event_type = data.event_type
        token_id = TokenId(**data.token_id)
        token_data_id = TokenDataId(**token_id.token_data_id)
        updated_at = datetime.fromtimestamp(int(data.timestamp))
        expired_at = datetime.fromtimestamp(int(data.expiration))

        async with prisma_client.tx(timeout=60000) as transaction:
            result = await transaction.curationexhibit.upsert(
                where={
                    'index_root': {
                        'index': int(data.id),
                        'root': config.curation.address()
                    }
                },
                data={
                    'create': {
                        'id': new_uuid(),
                        'chain': enums.Chain.APTOS,
                        'index': int(data.id),
                        'root': config.curation.address(),
                        'galleryIndex': gallery_index,
                        'curator':  data.origin,
                        'collectionIdentifier': token_data_id.collection,
                        'tokenIdentifier': token_data_id.name,
                        'tokenCreator': token_data_id.creator,
                        'propertyVersion': int(token_id.property_version),
                        'origin': data.origin,
                        'price': data.price,
                        'currency': '0x1::aptos_coin::AptosCoin',
                        'decimals': 8,
                        'expiredAt': expired_at,
                        'location': data.location,
                        'url': data.url,
                        'detail': data.detail,
                        'status': event_type_to_status[event_type],
                        'updatedAt': updated_at
                    },
                    'update': {
                        'chain': enums.Chain.APTOS,
                        'index': int(data.id),
                        'root': config.curation.address(),
                        'galleryIndex': gallery_index,
                        'curator':  data.origin,
                        'collectionIdentifier': token_data_id.collection,
                        'tokenIdentifier': token_data_id.name,
                        'tokenCreator': token_data_id.creator,
                        'propertyVersion': int(token_id.property_version),
                        'origin': data.origin,
                        'price': data.price,
                        'currency': '0x1::aptos_coin::AptosCoin',
                        'decimals': 8,
                        'expiredAt': expired_at,
                        'location': data.location,
                        'url': data.url,
                        'detail': data.detail,
                        'status': event_type_to_status[event_type],
                        'updatedAt': updated_at
                    }
                }
            )
            if result == None or result.status != event_type_to_status[event_type]:
                raise Exception(
                    f'[Curator exhibit]: Failed to update exhibit({data})')

            # token
            if event_type == 'ExhibitSold' or event_type == 'ExhibitRedeemed':
                owners = {
                    'ExhibitSold': data.buyer,
                    'ExhibitRedeemed': data.origin
                }
                updated_token = await transaction.aptostoken.update_many(
                    where={
                        'name': token_data_id.name,
                        'creator': token_data_id.creator,
                        'collection': token_data_id.collection,
                    },
                    data={
                        'owner': owners[event_type]
                    }
                )
                if updated_token == None:
                    raise Exception(
                        f"[Curator Offer]: Failed to update token owner with {event_type}")

            updated_offset = await transaction.eventoffset.update(
                where={'id': 0},
                data={
                    "exhibit_excuted_offset": int(seqno)
                }
            )
            if updated_offset == None:
                raise Exception(
                    f'[Curator exhibit]: Failed to update offset')

            new_state.new_offset.exhibit_excuted_offset = updated_offset.exhibit_excuted_offset
            return new_state, True