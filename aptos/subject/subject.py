import asyncio
import logging
from typing import Generic, List
from config import config
from model.event import T, Event
import aiohttp


class Subject(Generic[T]):
    def __init__(self) -> None:
        self.sema = asyncio.BoundedSemaphore(1)

    def url(self, event_handle: str, event_field: str, start: int, limit: int = 100) -> str:
        address = event_handle.split('::')[0]
        return f"{config.rand_node()}/accounts/{address}/events/{event_handle}/{event_field}?start={start}&limit={limit}"

    async def get_events(self, url: str) -> List[Event]:
        async with aiohttp.ClientSession() as session:
            async with self.sema, session.get(url) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    events = list(map(lambda x: Event(**x), data))
                    return events
                err_resp = await resp.text()
                logging.error(f"[subject]: {err_resp}")
                await asyncio.sleep(config.release_for_ratelimit())
                return []

    async def event_stream(self, event_handle: str, event_field: str):
        pass
