import logging
from typing import Generic, List
from model.event import T, Event
import aiohttp


class Subject(Generic[T]):

    def __init__(self, node_url: str, address: str) -> None:
        super().__init__()
        self.node_url = node_url
        self.address = address

    def url(self, event_handle: str, event_field: str, start: int, limit: int = 100) -> str:
        return f"{self.node_url}/accounts/{self.address}/events/{event_handle}/{event_field}?start={start}&limit={limit}"

    async def get_events(self, url: str) -> List[Event]:
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    events = list(map(lambda x: Event(**x), data))
                    return events
                err_resp = await resp.json()
                logging.error(f"[subject]: {err_resp}")
                return []

    async def event_stream(self, event_handle: str, event_field: str):
        pass
