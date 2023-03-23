from dataclasses import dataclass
from model.event import Event
from model.token_id import TokenId


@dataclass
class ExhibitEventData:
    id: str
    event_type: str
    gallery_id: str
    token_id: TokenId
    origin: str
    curator: str
    buyer: str
    expiration: str
    price: str
    location: str
    url: str
    detail: str
    timestamp: str


@dataclass
class ExhibitEvent(Event[ExhibitEventData]):
    pass
