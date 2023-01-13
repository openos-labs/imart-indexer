from dataclasses import dataclass
from model.event import Event
from model.token_id import TokenId


@dataclass
class ExhibitRedeemEventData:
    id: str
    gallery_id: str
    token_id: TokenId
    origin: str
    timestamp: str


@dataclass
class ExhibitRedeemEvent(Event[ExhibitRedeemEventData]):
    pass
