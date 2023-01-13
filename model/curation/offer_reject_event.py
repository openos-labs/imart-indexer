from dataclasses import dataclass
from model.event import Event
from model.token_id import TokenId


@dataclass
class OfferRejectEventData:
    id: str
    token_id: TokenId
    source: str
    destination: str
    timestamp: str


@dataclass
class OfferRejectEvent(Event[OfferRejectEventData]):
    pass
