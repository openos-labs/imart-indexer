from subject.subject import Subject
from model.curation.offer_create_event import OfferCreateEvent


class OfferCreateSubject(Subject[OfferCreateEvent]):
    async def event_stream(self, event_handle: str, event_field: str):
        state = None
        events = None
        while True:
            new_state = yield state
            url = self.url(event_handle, event_field,
                           new_state.new_offset.curation_offer_create_excuted_offset + 1)
            events = await super().get_events(url)
            yield events
