from dataclasses import dataclass
from typing import List, Tuple
from yaml import Loader
import yaml


@dataclass
class EventType:
    event_handle: str
    event_fields: List[str]

    def types(self) -> List[Tuple[str, str]]:
        return list(map(lambda event_field: (self.event_handle, event_field), self.event_fields))


@dataclass
class Config:
    node_url: str
    address: str
    fixed_market: EventType
    offer: EventType
    creation: EventType

    def __post_init__(self):
        self.offer = EventType(**self.offer)
        self.creation = EventType(**self.creation)
        self.fixed_market = EventType(**self.fixed_market)


global config
with open("config.yaml", 'r') as file:
    dict = yaml.load(file, Loader=Loader)
    config = Config(**dict)
