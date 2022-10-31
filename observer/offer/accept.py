from typing import List, Tuple
from model.token_id import TokenId, TokenDataId
from observer.observer import Observer
from model.offer.accept_offer_event import AcceptOfferEvent, AcceptOfferEventData
from model.state import State
from model.event import Event
from common.db import prisma_client
from prisma import enums


class AcceptOfferEventObserver(Observer[AcceptOfferEvent]):

    async def process_all(self, state: State, events: List[Event[AcceptOfferEvent]]) -> State:
        return await super().process_all(state, events)

    async def process(self, state: State, event: Event[AcceptOfferEvent]) -> Tuple[State, bool]:
        new_state = state
        seqno = int(event.sequence_number)
        data = AcceptOfferEventData(**event.data)
        token_data_id = TokenDataId(**TokenId(**data.token_id).token_data_id)

        token = await prisma_client.aptostoken.find_first(where={
            'name': token_data_id.name,
            'creator': token_data_id.creator,
            'collection': token_data_id.collection,
        })
        if token == None:
            raise Exception(
                f'[Accept Offer]: Token ({token_data_id}) not found but the offer ({data}) was existed.')

        offer = await prisma_client.aptosoffer.find_first(
            where={
                'offerer': data.coin_owner,
                'tokenId': token.id
            },
            order={
                "openedAt": "desc"
            }
        )
        if offer == None:
            raise Exception(
                f'[Accept Offer]: Offer ({token}) not found but the accepted event of offer ({data}) was existed.')

        async with prisma_client.tx(timeout=60000) as transaction:
            result = await transaction.aptosoffer.update(
                where={
                    "id": offer.id
                },
                data={
                    'status': enums.OfferStatus.ACCEPTED
                }
            )
            if result == None or result.status != enums.OfferStatus.ACCEPTED:
                raise Exception(
                    f'[Accept Offer]: Failed to update offer status to ACCEPTED')

            updated_offset = await transaction.eventoffset.update(
                where={'id': 0},
                data={
                    "accept_offer_excuted_offset": seqno
                }
            )
            if updated_offset == None:
                raise Exception(f'[Accept Offer]: Failed to update offset')

            new_state.new_offset.accept_offer_excuted_offset = updated_offset.accept_offer_excuted_offset
            return new_state, True
