from dataclasses import dataclass
from model.coin_type_info import CoinTypeInfo
from model.token_id import TokenId
from model.event import Event


@dataclass
class CancelOfferEventData:
    coin_amount: str
    coin_owner: str
    coin_type_info: CoinTypeInfo
    event_id: str
    timestamp: str
    token_id: TokenId


@dataclass
class CancelOfferEvent(Event[CancelOfferEventData]):
    pass
