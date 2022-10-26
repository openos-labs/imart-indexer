from dataclasses import dataclass
from model.coin_type_info import CoinTypeInfo
from model.token_id import TokenId
from model.event import Event


@dataclass
class ListEventData:
    coin_type_info: CoinTypeInfo
    offer_id: str
    price: str
    seller: str
    timestamp: str
    token_amount: str
    token_id: TokenId
    locked_until_secs: str


@dataclass
class ListEvent(Event[ListEventData]):
    pass
