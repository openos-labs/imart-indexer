from dataclasses import dataclass
from model.event import Event


@dataclass
class CreateTokenEventData:
    description: str
    name: str
    uri: str
    user: str


@dataclass
class CreateTokenEvent(Event[CreateTokenEventData]):
    pass
