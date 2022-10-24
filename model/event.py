from dataclasses import dataclass
from typing import Generic, Optional, TypeVar

T = TypeVar('T')


@dataclass
class Event(Generic[T]):
    sequence_number: str
    type: str
    data: T
    version: Optional[any] = None
    guid: Optional[any] = None
