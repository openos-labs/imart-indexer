import logging
from typing import List, Tuple
from model.event import T, Event
from model.state import State


class Observer(Event[T]):

    def __init__(self) -> None:
        pass

    async def process_all(self, state: State, events: List[Event[T]]) -> State:
        if len(events) == 0:
            return state
        current_state = state
        logging.info(
            f"[Observer]: received events from seq no {events[0].sequence_number} to {events[-1].sequence_number}: {events}")
        for event in events:
            try:
                (new_state, success) = await self.process(current_state, event)
                if not success:
                    return current_state
                current_state = new_state
            except Exception as err:
                logging.error(err)
                return current_state
        return current_state

    async def process(self, state: State, event: Event[T]) -> Tuple[State, bool]:
        pass
