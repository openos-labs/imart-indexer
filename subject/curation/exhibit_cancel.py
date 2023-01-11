from subject.subject import Subject
from model.curation.exhibit_cancel_event import ExhibitCancelEvent


class ExhibitCancelSubject(Subject[ExhibitCancelEvent]):
    async def event_stream(self, event_handle: str, event_field: str):
        state = None
        events = None
        while True:
            new_state = yield state
            url = self.url(event_handle, event_field,
                           new_state.new_offset.exhibit_cancel_excuted_offset + 1)
            events = await super().get_events(url)
            yield events
