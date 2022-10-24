from dataclasses import dataclass


@dataclass
class Offset:
    list_events_excuted_offset: int
    buy_events_excuted_offset: int


@dataclass
class State:
    new_offset: Offset
    old_offset: Offset


def empty_offset() -> Offset:
    return Offset(-1, -1)
