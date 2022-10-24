import logging
from typing import List
from observer.observer import Observer
from model.list_event import ListEvent
from model.state import State
from model.event import Event, T


class ListEventObserver(Observer[ListEvent]):

    async def process_all(self, state: State, events: List[Event[T]]) -> State:
        new_state = await super().process_all(state, events)
        logging.info(f'[state]: {new_state}')
        return new_state

    async def process(self, state: State, event: Event[T]) -> bool:
        pass
