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
from typing import Tuple
from config import config
from common.db import connect_db, prisma_client
from observer.accept_offer_observer import AcceptOfferEventObserver
from observer.buy_event_observer import BuyEventObserver
from observer.cancel_offer_observer import CancelOfferEventObserver
from observer.create_offer_observer import CreateOfferEventObserver
from observer.observer import Observer
from observer.list_event_observer import ListEventObserver
from observer.delist_event_observer import DelistEventObserver
from model.state import State, empty_offset, Offset
from subject.accept_offer_subject import AcceptOfferSubject
from subject.buy_event_subject import BuyEventSubject
from subject.cancel_offer_subject import CancelOfferSubject
from subject.create_offer_subject import CreateOfferSubject
from subject.list_events_subject import ListEventSubject
from subject.delist_event_subject import DelistEventSubject

subject_to_observer = {
    "BuyEventSubject": BuyEventObserver(),
    "ListEventSubject": ListEventObserver(),
    "DelistEventSubject": DelistEventObserver(),
    "CreateOfferSubject": CreateOfferEventObserver(),
    "CancelOfferSubject": CancelOfferEventObserver(),
    "AcceptOfferSubject": AcceptOfferEventObserver()
}

event_to_subject = {
    "buy_token_events": BuyEventSubject(config.node_url, config.address),
    "list_token_events": ListEventSubject(config.node_url, config.address),
    "delist_token_events": DelistEventSubject(config.node_url, config.address),
    "offer_token_events": CreateOfferSubject(config.node_url, config.address),
    "accept_offer_events": AcceptOfferSubject(config.node_url, config.address),
    "cancel_offer_events": CancelOfferSubject(config.node_url, config.address)
}


async def initial_state() -> State:
    offset = await prisma_client.eventoffset.find_first(where={'id': 0})
    new_offset = Offset(
        offset.buy_event_excuted_offset,
        offset.list_event_excuted_offset,
        offset.delist_event_excuted_offset,
        offset.create_offer_excuted_offset,
        offset.accept_offer_excuted_offset,
        offset.cancel_offer_excuted_offset
    )
    return State(new_offset=new_offset, old_offset=empty_offset())


async def subscribe(observer: Observer):
    comming_events = None
    state = None
    new_state = yield state
    while True:
        events = yield comming_events
        new_state = await observer.process_all(new_state, events)
        yield new_state


# A worker correspond to a thread or a pair of bidirectional channels
async def worker(state: State, event_type: Tuple[str, str]):
    (event_handle, event_field) = event_type
    current_state = state
    subject = event_to_subject[event_field]
    subject_type = type(subject).__name__
    observer = subject_to_observer[subject_type]

    # channel for process events
    process_events = subscribe(observer)
    await anext(process_events)
    await process_events.asend(current_state)

    # channel for fire events
    fire_events = subject.event_stream(event_handle, event_field)
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
    await connect_db()
    # init state with excuted seq no
    state = await initial_state()
    workers = []
    event_types = []
    event_types.extend(config.fixed_market.types())
    event_types.extend(config.offer.types())

    # allocate one worker per event field
    for event_type in event_types:
        workers.append(worker(state, event_type))
    await asyncio.gather(*workers)


if __name__ == "__main__":
    logging.basicConfig(filename='error.log', level=logging.INFO,
                        format='%(asctime)s %(levelname)-8s %(message)s')
    logging.info('started')
    asyncio.run(main())
