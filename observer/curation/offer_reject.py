from datetime import datetime
from typing import List, Tuple
from common.util import new_uuid
from observer.observer import Observer
from model.curation.offer_reject_event import OfferRejectEvent, OfferRejectEventData
from model.state import State
from model.event import Event
from common.db import prisma_client
from prisma import enums
from config import config


class OfferRejectEventObserver(Observer[OfferRejectEvent]):

    async def process_all(self, state: State, events: List[Event[OfferRejectEvent]]) -> State:
        return await super().process_all(state, events)

    async def process(self, state: State, event: Event[OfferRejectEvent]) -> Tuple[State, bool]:
        new_state = state
        seqno = event.sequence_number
        data = OfferRejectEventData(**event.data)
        index = int(data.id)
        updated_at = datetime.fromtimestamp(int(data.timestamp))
        async with prisma_client.tx(timeout=60000) as transaction:
            result = await transaction.curationoffer.update(
                where={
                    'index_root': {
                        'index': index,
                        'root': config.curation.address()
                    }
                },
                data={
                    'status':  enums.CurationOfferStatus.rejected,
                    'updatedAt': updated_at
                }
            )
            if result == None or result.status != enums.CurationOfferStatus.rejected:
                raise Exception(
                    f'[Curator reject offer]: Failed to reject curation offer({data})')

            updated_offset = await transaction.eventoffset.update(
                where={'id': 0},
                data={
                    "curation_offer_reject_excuted_offset": int(seqno)
                }
            )
            if updated_offset == None:
                raise Exception(
                    f'[Curation reject Offer]: Failed to update offset')

            await transaction.notification.upsert(
                where={
                    'receiver_type_timestamp': {
                        'receiver': data.source,
                        'type': enums.NotificationType.CurationOfferRejectedFromInvitee,
                        'timestamp': updated_at
                    }
                },
                data={
                    'create': {
                        'id': new_uuid(),
                        'receiver': data.source,
                        'title': "Your offer has been rejected",
                        'content': "From IMart",
                        'image': "",
                        'type': enums.NotificationType.CurationOfferRejectedFromInvitee,
                        'unread': True,
                        'timestamp': updated_at,
                        'detail': f'{{"name": {result.tokenName}, "collection": {result.collection}, "creator": {result.tokenCreator}, "propertyVersion": {result.propertyVersion}}}'
                    },
                    'update': {
                        'receiver': data.source,
                        'title': "Your offer has been rejected",
                        'content': "From IMart",
                        'image': "",
                        'type': enums.NotificationType.CurationOfferRejectedFromInvitee,
                        'unread': True,
                        'timestamp': updated_at,
                        'detail': f'{{"name": {result.tokenName}, "collection": {result.collection}, "creator": {result.tokenCreator}, "propertyVersion": {result.propertyVersion}}}'
                    }
                }
            )
            new_state.new_offset.curation_offer_reject_excuted_offset = updated_offset.curation_offer_reject_excuted_offset
            return new_state, True
