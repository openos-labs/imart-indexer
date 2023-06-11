from dataclasses import dataclass
from model.coin_type_info import CoinTypeInfo
from model.token_id import TokenId
from model.event import Event


@dataclass
class CreateOfferEventData:
    coin_amount_per_token: str
    coin_owner: str
    coin_type_info: CoinTypeInfo
    event_id: str
    expiration_time: str
    timestamp: str
    token_amount: str
    token_id: TokenId


@dataclass
class CreateOfferEvent(Event[CreateOfferEventData]):
    pass
