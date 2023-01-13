from dataclasses import dataclass
from model.event import Event
from model.token_id import TokenId


@dataclass
class GalleryCreateEventData:
    id: str
    owner: str
    token_id: TokenId
    space_type: str
    name: str
    metadata_uri: str
    timestamp: str


@dataclass
class GalleryCreateEvent(Event[GalleryCreateEventData]):
    pass
