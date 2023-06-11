from dataclasses import dataclass
from typing import List
from model.event import Event
from model.token_id import TokenId


@dataclass
class GalleryEventData:
    id: str
    event_type: str
    owner: str
    token_id: TokenId
    space_type: str
    name: str
    metadata_uri: str
    timestamp: str
    payees: List[str]
    commission_rates: List[str]


@dataclass
class GalleryEvent(Event[GalleryEventData]):
    pass
