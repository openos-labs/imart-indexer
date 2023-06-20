from dataclasses import dataclass
from common.db import prisma_client


@dataclass
class Offset:
    buy_events_excuted_offset: int
    list_events_excuted_offset: int
    delist_events_excuted_offset: int
    create_offer_excuted_offset: int
    accept_offer_excuted_offset: int
    cancel_offer_excuted_offset: int
    creation_token_created_excuted_offset: int
    creation_collection_created_excuted_offset: int
    single_collective_created_excuted_offset: int
    multiple_collective_created_excuted_offset: int
    exhibit_excuted_offset: int
    gallery_excuted_offset: int
    curation_offer_excuted_offset: int


@dataclass
class State:
    new_offset: Offset
    old_offset: Offset


def empty_offset() -> Offset:
    return Offset(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1)


async def initial_state() -> State:
    offset = await prisma_client.eventoffset.find_first(where={'id': 0})
    if offset == None:
        await prisma_client.eventoffset.create(
            data={
                'id': 0,
                'buy_event_excuted_offset': -1,
                'list_event_excuted_offset': -1,
                'delist_event_excuted_offset': -1,
                'create_offer_excuted_offset': -1,
                'accept_offer_excuted_offset': -1,
                'cancel_offer_excuted_offset': -1,
                'creation_token_created_excuted_offset': -1,
                'creation_collection_created_excuted_offset': -1,
                'single_collective_created_excuted_offset': -1,
                'multiple_collective_created_excuted_offset': -1,
                'exhibit_excuted_offset': -1,
                'gallery_excuted_offset': -1,
                'curation_offer_excuted_offset': -1
            }
        )
        return State(new_offset=empty_offset(), old_offset=empty_offset())
    new_offset = Offset(
        offset.buy_event_excuted_offset,
        offset.list_event_excuted_offset,
        offset.delist_event_excuted_offset,
        offset.create_offer_excuted_offset,
        offset.accept_offer_excuted_offset,
        offset.cancel_offer_excuted_offset,
        offset.creation_token_created_excuted_offset,
        offset.creation_collection_created_excuted_offset,
        offset.single_collective_created_excuted_offset,
        offset.multiple_collective_created_excuted_offset,
        offset.exhibit_excuted_offset,
        offset.gallery_excuted_offset,
        offset.curation_offer_excuted_offset,
    )

    return State(new_offset=new_offset, old_offset=empty_offset())
