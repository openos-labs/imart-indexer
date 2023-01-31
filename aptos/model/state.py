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
    create_token_excuted_offset: int
    gallery_create_excuted_offset: int
    exhibit_list_excuted_offset: int
    exhibit_cancel_excuted_offset: int
    exhibit_freeze_excuted_offset: int
    exhibit_redeem_excuted_offset: int
    exhibit_buy_excuted_offset: int
    curation_offer_create_excuted_offset: int
    curation_offer_accept_excuted_offset: int
    curation_offer_reject_excuted_offset: int
    curation_offer_cancel_excuted_offset: int


@dataclass
class State:
    new_offset: Offset
    old_offset: Offset


def empty_offset() -> Offset:
    return Offset(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1)


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
                'create_token_excuted_offset': -1,
                'gallery_create_excuted_offset': -1,
                'exhibit_list_excuted_offset': -1,
                'exhibit_cancel_excuted_offset': -1,
                'exhibit_freeze_excuted_offset': -1,
                'exhibit_redeem_excuted_offset': -1,
                'exhibit_buy_excuted_offset': -1,
                'curation_offer_create_excuted_offset': -1,
                'curation_offer_accept_excuted_offset': -1,
                'curation_offer_reject_excuted_offset': -1,
                'curation_offer_cancel_excuted_offset': -1
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
        offset.create_token_excuted_offset,
        offset.gallery_create_excuted_offset,
        offset.exhibit_list_excuted_offset,
        offset.exhibit_cancel_excuted_offset,
        offset.exhibit_freeze_excuted_offset,
        offset.exhibit_redeem_excuted_offset,
        offset.exhibit_buy_excuted_offset,
        offset.curation_offer_create_excuted_offset,
        offset.curation_offer_accept_excuted_offset,
        offset.curation_offer_reject_excuted_offset,
        offset.curation_offer_cancel_excuted_offset
    )

    return State(new_offset=new_offset, old_offset=empty_offset())
