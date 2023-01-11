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

from subject.curation.exhibit_redeem import ExhibitRedeemSubject
from subject.curation.exhibit_list import ExhibitListSubject
from subject.curation.exhibit_freeze import ExhibitFreezeSubject
from subject.curation.exhibit_cancel import ExhibitCancelSubject
from subject.curation.exhibit_buy import ExhibitBuySubject
from subject.curation.offer_reject import OfferRejectSubject
from subject.curation.offer_create import OfferCreateSubject
from subject.curation.offer_cancel import OfferCancelSubject
from subject.curation.offer_accept import OfferAcceptSubject
from subject.curation.gallery_create import GalleryCreateSubject
from subject.order.delist import DelistEventSubject
from subject.order.list import ListEventSubject
from subject.order.buy import BuyEventSubject
from subject.offer.create import CreateOfferSubject
from subject.offer.cancel import CancelOfferSubject
from subject.offer.accept import AcceptOfferSubject
from subject.creation.create_token import CreateTokenSubject
from model.state import State, initial_state
from observer.curation.exhibit_buy import ExhibitBuyEventObserver
from observer.curation.exhibit_freeze import ExhibitFreezeEventObserver
from observer.curation.exhibit_redeem import ExhibitRedeemEventObserver
from observer.curation.exhibit_cancel import ExhibitCancelEventObserver
from observer.curation.exhibit_list import ExhibitListEventObserver
from observer.curation.offer_reject import OfferRejectEventObserver
from observer.curation.offer_cancel import OfferCancelEventObserver
from observer.curation.offer_accept import OfferAcceptEventObserver
from observer.curation.offer_create import OfferCreateEventObserver
from observer.curation.gallery_create import GalleryCreateEventObserver
from observer.order.delist import DelistEventObserver
from observer.order.list import ListEventObserver
from observer.order.buy import BuyEventObserver
from observer.offer.create import CreateOfferEventObserver
from observer.offer.cancel import CancelOfferEventObserver
from observer.offer.accept import AcceptOfferEventObserver
from observer.observer import Observer
from observer.creation.token import CreateTokenEventObserver
import asyncio
import logging
from typing import Tuple
from config import config
from common.db import connect_db

subject_to_observer = {
    "BuyEventSubject": BuyEventObserver(),
    "ListEventSubject": ListEventObserver(),
    "DelistEventSubject": DelistEventObserver(),
    "CreateOfferSubject": CreateOfferEventObserver(),
    "CancelOfferSubject": CancelOfferEventObserver(),
    "AcceptOfferSubject": AcceptOfferEventObserver(),
    "CreateTokenSubject": CreateTokenEventObserver(),
    "GalleryCreateSubject": GalleryCreateEventObserver(),
    "OfferCreateSubject": OfferCreateEventObserver(),
    "OfferAcceptSubject": OfferAcceptEventObserver(),
    "OfferCancelSubject": OfferCancelEventObserver(),
    "OfferRejectSubject": OfferRejectEventObserver(),
    "ExhibitListSubject": ExhibitListEventObserver(),
    "ExhibitBuySubject": ExhibitBuyEventObserver(),
    "ExhibitFreezeSubject": ExhibitFreezeEventObserver(),
    "ExhibitCancelSubject": ExhibitCancelEventObserver(),
    "ExhibitRedeemSubject": ExhibitRedeemEventObserver()
}

event_to_subject = {
    "buy_token_events": BuyEventSubject(),
    "list_token_events": ListEventSubject(),
    "delist_token_events": DelistEventSubject(),
    "offer_token_events": CreateOfferSubject(),
    "accept_offer_events": AcceptOfferSubject(),
    "cancel_offer_events": CancelOfferSubject(),
    "create_events": CreateTokenSubject(),
    "gallery_created_events": GalleryCreateSubject(),
    "offer_created_events": OfferCreateSubject(),
    "offer_accepted_events": OfferAcceptSubject(),
    "offer_rejected_events": OfferRejectSubject(),
    "offer_canceled_events": OfferCancelSubject(),
    "exhibit_listed_events": ExhibitListSubject(),
    "exhibit_canceled_events": ExhibitCancelSubject(),
    "exhibit_sold_events": ExhibitBuySubject(),
    "exhibit_frozen_events": ExhibitFreezeSubject(),
    "exhibit_redeemed_events": ExhibitRedeemSubject()
}


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
    event_types = config.event_types()

    # allocate one worker per event field
    for event_type in event_types:
        workers.append(worker(state, event_type))
    await asyncio.gather(*workers)


if __name__ == "__main__":
    logging.basicConfig(filename='error.log', level=logging.INFO,
                        format='%(asctime)s %(levelname)-8s %(message)s')
    logging.info('started')
    asyncio.run(main())
