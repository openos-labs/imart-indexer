from dataclasses import dataclass
from typing import List, Tuple
from yaml import Loader
import yaml
from dotenv import dotenv_values
env = dotenv_values(".env")


@dataclass
class EventType:
    event_handle: str
    event_fields: List[str]

    def types(self) -> List[Tuple[str, str]]:
        return list(map(lambda event_field: (self.event_handle, event_field), self.event_fields))

    def address(self) -> str:
        return self.event_handle.split('::')[0]

@dataclass
class Config:
    node_url: str
    redis_url: str
    fixed_market: EventType
    offer: EventType
    creation: EventType
    curation: EventType

    def __post_init__(self):
        self.offer = EventType(**self.offer)
        self.creation = EventType(**self.creation)
        self.fixed_market = EventType(**self.fixed_market)
        self.curation = EventType(**self.curation)

    def event_types(self):
        event_types = []
        modules = env['MODUELS'].split(',')
        if 'fixed_market' in modules:
            event_types.extend(self.fixed_market.types())
        if 'offer' in modules:
            event_types.extend(self.offer.types())
        if 'creation' in modules:
            event_types.extend(self.creation.types())
        if 'curation' in modules:
            event_types.extend(self.curation.types())
        return event_types


global config
with open("config.yaml", 'r') as file:
    dict = yaml.load(file, Loader=Loader)
    config = Config(**dict)
