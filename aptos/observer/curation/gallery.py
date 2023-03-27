import json
from typing import List, Tuple
from observer.observer import Observer
from model.curation.gallery_event import GalleryEvent, GalleryEventData
from model.state import State
from model.event import Event
from common.db import prisma_client
from common.redis import redis_cli
from config import config
from common.util import new_uuid
from prisma import enums, Json
import requests


class GalleryEventObserver(Observer[GalleryEvent]):

    async def process_all(self, state: State, events: List[Event[GalleryEvent]]) -> State:
        return await super().process_all(state, events)

    async def process(self, state: State, event: Event[GalleryEvent]) -> Tuple[State, bool]:
        new_state = state
        seqno = event.sequence_number
        data = GalleryEventData(**event.data)
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
                    f'[Curator gallery]: Failed to update gallery({data})')
            r = requests.get(data.metadata_uri)
            metadata = r.json()
            curation_id = metadata['id']
            metadata = metadata.update(result)
            metadata_str = json.dumps(
                metadata, indent=4, sort_keys=True, default=str)
            key_curation_id = f'mixverse:curation:{curation_id}'
            key_curation_root_index = f"mixverse:curation:{config.curation.address()}:{index}"
            redis_cli.set(key_curation_id, metadata_str)
            redis_cli.set(key_curation_root_index, metadata_str)

            updated_offset = await transaction.eventoffset.update(
                where={'id': 0},
                data={
                    "gallery_excuted_offset": int(seqno)
                }
            )
            if updated_offset == None:
                raise Exception(
                    f'[Curator Gallery]: Failed to update offset')

            new_state.new_offset.gallery_excuted_offset = updated_offset.gallery_excuted_offset
            return new_state, True
