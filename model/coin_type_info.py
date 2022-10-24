from dataclasses import dataclass


@dataclass
class CoinTypeInfo:
    account_address: str
    module_name: str
    struct_name: str
