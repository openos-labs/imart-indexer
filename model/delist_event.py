from dataclasses import dataclass
from model.token_id import TokenId
from model.event import Event


@dataclass
class DelistEventData:
    offer_id: str
    seller: str
    timestamp: str
    token_amount: str
    token_id: TokenId


@dataclass
class DelistEvent(Event[DelistEventData]):
    pass
