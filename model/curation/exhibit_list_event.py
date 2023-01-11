from dataclasses import dataclass
from model.event import Event
from model.token_id import TokenId


@dataclass
class ExhibitListEventData:
    id: str
    gallery_id: str
    token_id: TokenId
    origin: str
    expiration: str
    price: str
    commission_feerate_numerator: str
    commission_feerate_denominator: str
    location: str


@dataclass
class ExhibitListEvent(Event[ExhibitListEventData]):
    pass
