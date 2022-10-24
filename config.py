from dataclasses import dataclass
from typing import List
from yaml import Loader
import yaml


@dataclass
class Config:
    node_url: str
    address: str
    event_handle: str
    event_fields: List[str]


global config
with open("config.yaml", 'r') as file:
    dict = yaml.load(file, Loader=Loader)
    config = Config(**dict)
