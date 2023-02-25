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
    location: str
    url: str
    detail: str
    timestamp: str


@dataclass
class ExhibitListEvent(Event[ExhibitListEventData]):
    pass
