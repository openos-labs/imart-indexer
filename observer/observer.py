import logging
from typing import List
from model.event import T, Event
from model.state import State


class Observer(Event[T]):

    def __init__(self) -> None:
        pass

    async def process_all(self, state: State, events: List[Event[T]]) -> State:
        if len(events) == 0:
            return state
        new_state = state

        logging.info(
            f"[Observer]: received events from seq no {events[0].sequence_number} to {events[-1].sequence_number}: {events}")
        for event in events:
            if not await self.process(new_state, event):
                return new_state
        return new_state

    async def process(self, state: State, event: Event[T]) -> bool:
        pass
