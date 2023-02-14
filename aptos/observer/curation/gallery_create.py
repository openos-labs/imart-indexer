from typing import List, Tuple
from observer.observer import Observer
from model.curation.gallery_create_event import GalleryCreateEvent, GalleryCreateEventData
from model.state import State
from model.event import Event
from common.db import prisma_client
from config import config
from common.util import new_uuid
from prisma import enums, Json


class GalleryCreateEventObserver(Observer[GalleryCreateEvent]):

    async def process_all(self, state: State, events: List[Event[GalleryCreateEvent]]) -> State:
        return await super().process_all(state, events)

    async def process(self, state: State, event: Event[GalleryCreateEvent]) -> Tuple[State, bool]:
        new_state = state
        seqno = event.sequence_number
        data = GalleryCreateEventData(**event.data)
        index = int(data.id)

        async with prisma_client.tx(timeout=60000) as transaction:
            result = await transaction.curationgallery.upsert(
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
                        'name': data.name,
                        'owner': data.owner,
                        'spaceType': data.space_type,
                        'metadataUri': data.metadata_uri,
                        'commissionRates': Json(dict(zip(data.payees, data.commission_rates))),
                        'commissionPool': ""
                    },
                    'update': {
                        'chain': enums.Chain.APTOS,
                        'name': data.name,
                        'owner': data.owner,
                        'spaceType': data.space_type,
                        'metadataUri': data.metadata_uri,
                        'commissionRates': Json(dict(zip(data.payees, data.commission_rates)))
                    }
                }
            )
            if result == None:
                raise Exception(
                    f'[Curator create gallery]: Failed to create gallery({data})')

            updated_offset = await transaction.eventoffset.update(
                where={'id': 0},
                data={
                    "gallery_create_excuted_offset": int(seqno)
                }
            )
            if updated_offset == None:
                raise Exception(
                    f'[Curator create Gallery]: Failed to update offset')

            new_state.new_offset.gallery_create_excuted_offset = updated_offset.gallery_create_excuted_offset
            return new_state, True
