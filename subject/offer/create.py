from subject.subject import Subject
from model.offer.create_offer_event import CreateOfferEvent


class CreateOfferSubject(Subject[CreateOfferEvent]):
    async def event_stream(self, event_handle: str, event_field: str):
        state = None
        events = None
        while True:
            new_state = yield state
            url = self.url(event_handle, event_field,
                           new_state.new_offset.create_offer_excuted_offset + 1)
            events = await super().get_events(url)
            yield events
