from dataclasses import dataclass
from common.util import unhex_decode


@dataclass
class CoinTypeInfo:
    account_address: str
    module_name: str
    struct_name: str

    def currency(self) -> str:
        return f'{self.account_address}::{unhex_decode(self.module_name)}::{unhex_decode(self.struct_name)}'
