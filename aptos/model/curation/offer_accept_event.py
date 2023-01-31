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
    commission_feerate_numerator: str
    commission_feerate_denominator: str
    exhibit_duration: str
    timestamp: str


@dataclass
class OfferAcceptEvent(Event[OfferAcceptEventData]):
    pass
