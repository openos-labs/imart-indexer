from dataclasses import dataclass


@dataclass
class Offset:
    buy_events_excuted_offset: int
    list_events_excuted_offset: int
    delist_events_excuted_offset: int
    create_offer_excuted_offset: int
    accept_offer_excuted_offset: int
    cancel_offer_excuted_offset: int


@dataclass
class State:
    new_offset: Offset
    old_offset: Offset


def empty_offset() -> Offset:
    return Offset(-1, -1, -1, -1, -1, -1)
