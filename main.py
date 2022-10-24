# Copyleft © 2022 Amovane@163.com
#
#         List event Worker                 +-----------------------+                 Buy event worker
#  +-------------------------------+        |                       |        +-------------------------------+
#  |     +-------------------+     |        |  xxx event worker     |        |    +---------------------+    |
#  |     |                   |     |        |                       |        |    |                     |    |
#  |     |     Subject       |     |        |                       |        |    |     Subject         |    |
#  |     |                   |     |        +-----------------------+        |    |                     |    |
#  |     +-----|------^------+     |                                         |    +------|------^-------+    |
#  |           |      |            |                                         |           |      |            |
#  |           |      |            |      +--------------------------+       |           |      |            |
#  (list events    (excuted seq no)|      |  +--------------------+  |       (buy events |      |            |
#  | /seq no)  |      |            |      |  |    xxx State       |  |       |  / seq no)|   (excuted seq no)|
#  |           |      |            |      |  |                    |  |       |           |      |            |
#  |  +--------v------|--------+   |      |  |   Offer/Sale ...   |  |       |           |      |            |
#  |  |                        |   |      |  |                    |  |       |  +--------v------|--------+   |
#  |  |       Observer         |   |      |  | record seq no      |  |       |  |       Observer         |   |
#  |  |                        |   |      |  |                    |  |       |  |                        |   |
#  |  |                        |   |      |  +--------------------+  |       |  |                        |   |
#  |  |   +----------------+   |   |      |  +--------------------+  |       |  |    +---------------+   |   |
#  |  |   |  Order List    ---------------|-->    Order state     <--|----------|----| Order buy     |   |   |
#  |  |   |                |-\ |   |      |  |                    |  |       |  |    |               |   |   |
#  |  |   +----------------+  -\   |      |  | record seq no      |  |       |  |  /-+---------------+   |   |
#  |  +------------------------+--\|      |  +--------------------+  |       | /-------------------------+   |
#  +--------------------------------\     |                          |      /--------------------------------+
#                                    -\   |                          |   /--
#                                      --\|                          |---
#                                         |\                      /--|
#                                         | ->------------------<-+  |
#                                         |  |                    |  |
#                                         |  |    Activities      |  |
#                                         |  |                    |  |
#                                         |  | record seq no      |  |
#                                         |  |                    |  |
#                                         |  +--------------------+  |
#                                         +--------------------------+
#
#                                                 DB / Cache

import asyncio
import logging
from config import config
from observer.observer import Observer
from observer.list_event_observer import ListEventObserver
from model.state import State, empty_offset
from subject.list_events_subject import ListEventSubject

subject_to_observer = {
    "ListEventSubject": ListEventObserver(),
}

event_to_subject = {
    "list_token_events": ListEventSubject(config.node_url, config.address)
}


async def initial_state() -> State:
    return State(new_offset=empty_offset(), old_offset=empty_offset())


async def subscribe(observer: Observer):
    comming_events = None
    state = None
    new_state = yield state
    while True:
        events = yield comming_events
        new_state = await observer.process_all(new_state, events)
        yield new_state


# A worker correspond to a thread or a pair of bidirectional channels
async def worker(state: State, event_field: str):
    current_state = state
    subject = event_to_subject[event_field]
    subject_type = type(subject).__name__
    observer = subject_to_observer[subject_type]

    # channel for process events
    process_events = subscribe(observer)
    await anext(process_events)
    await process_events.asend(current_state)

    # channel for fire events
    fire_events = subject.event_stream(config.event_handle, event_field)
    await anext(fire_events)

    while True:
        events = await fire_events.asend(current_state)
        new_state = await process_events.asend(events)
        current_state = new_state
        await anext(fire_events)
        await anext(process_events)

        # rest period for next fire
        await asyncio.sleep(5)


async def main():
    # init state with excuted seq no
    state = await initial_state()
    workers = []

    # allocate one worker per event field
    for event_field in config.event_fields:
        workers.append(worker(state, event_field))
    await asyncio.gather(*workers)


if __name__ == "__main__":
    logging.basicConfig(filename='error.log', level=logging.INFO)
    asyncio.run(main())
