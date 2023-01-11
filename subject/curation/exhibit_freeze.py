from subject.subject import Subject
from model.curation.exhibit_freeze_event import ExhibitFreezeEvent


class ExhibitFreezeSubject(Subject[ExhibitFreezeEvent]):
    async def event_stream(self, event_handle: str, event_field: str):
        state = None
        events = None
        while True:
            new_state = yield state
            url = self.url(event_handle, event_field,
                           new_state.new_offset.exhibit_freeze_excuted_offset + 1)
            events = await super().get_events(url)
            yield events
