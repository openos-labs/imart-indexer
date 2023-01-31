from dataclasses import dataclass
from model.event import Event
from model.token_id import TokenId


@dataclass
class OfferCancelEventData:
    id: str
    token_id: TokenId
    source: str
    destination: str
    timestamp: str


@dataclass
class OfferCancelEvent(Event[OfferCancelEventData]):
    pass
