from dataclasses import dataclass
from model.coin_type_info import CoinTypeInfo
from model.token_id import TokenId
from model.event import Event


@dataclass
class AcceptOfferEventData:
    is_offer_end: str
    token_id: TokenId
    coin_owner: str
    token_owner: str
    token_amount: str
    coin_amount_per_token: str
    timestamp: str
    event_id: str
    coin_type_info: CoinTypeInfo
    expiration_time: str


@dataclass
class AcceptOfferEvent(Event[AcceptOfferEventData]):
    pass
