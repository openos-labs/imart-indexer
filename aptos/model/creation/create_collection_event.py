from dataclasses import dataclass
from typing import List
from model.event import Event


@dataclass
class CreateCollectionEventData:
    creator: str
    category: str
    tags: List[str]
    name: str
    description: str
    uri: str
    payees: List[str]
    royalties: List[str]
    maximum: str


@dataclass
class CreateCollectionEvent(Event[CreateCollectionEventData]):
    pass
