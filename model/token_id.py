from dataclasses import dataclass


@dataclass
class TokenDataId:
    collection: str
    creator: str
    name: str


@dataclass
class TokenId:
    property_version: str
    token_data_id: TokenDataId
