from dataclasses import dataclass
from model.event import Event
from model.token_id import TokenId


@dataclass
class CreateTokenEventData:
    description: str
    name: str
    uri: str
    creator: str
    token_id: TokenId


@dataclass
class CreateTokenEvent(Event[CreateTokenEventData]):
    pass
