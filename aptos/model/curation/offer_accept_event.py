from dataclasses import dataclass
from model.event import Event
from model.token_id import TokenId


@dataclass
class OfferAcceptEventData:
    id: str
    token_id: TokenId
    source: str
    destination: str
    price: str
    gallery_id: str
    exhibit_expired_at: str
    timestamp: str


@dataclass
class OfferAcceptEvent(Event[OfferAcceptEventData]):
    pass
