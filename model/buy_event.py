from dataclasses import dataclass
from model.coin_type_info import CoinTypeInfo
from model.token_id import TokenId
from model.event import Event


@dataclass
class BuyEventData:
    coin_type_info: CoinTypeInfo
    offer_id: str
    price: str
    buyer: str
    seller: str
    timestamp: str
    coin_amount: str
    token_amount: str
    token_id: TokenId


@dataclass
class BuyEvent(Event[BuyEventData]):
    pass
