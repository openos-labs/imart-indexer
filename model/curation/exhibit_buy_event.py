from dataclasses import dataclass
from model.event import Event
from model.token_id import TokenId


@dataclass
class ExhibitBuyEventData:
    id: str
    gallery_id: str
    token_id: TokenId
    origin: str
    price: str
    commission_feerate_numerator: str
    commission_feerate_denominator: str


@dataclass
class ExhibitBuyEvent(Event[ExhibitBuyEventData]):
    pass
