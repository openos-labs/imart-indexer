from subject.subject import Subject
from model.list_event import ListEvent


class ListEventSubject(Subject[ListEvent]):
    async def event_stream(self, event_handle: str, event_field: str):
        state = None
        events = None
        while True:
            new_state = yield state
            url = self.url(event_handle, event_field,
                           new_state.new_offset.list_events_excuted_offset + 1)
            events = await super().get_events(url)
            yield events
