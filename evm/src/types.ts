import { Subject } from "rxjs";
import {
  Curation,
  ExhibitCanceledEvent,
  ExhibitCanceledEventFilter,
  ExhibitFrozenEvent,
  ExhibitFrozenEventFilter,
  ExhibitListedEvent,
  ExhibitListedEventFilter,
  ExhibitRedeemedEvent,
  ExhibitRedeemedEventFilter,
  ExhibitSoldEvent,
  ExhibitSoldEventFilter,
  OfferAcceptedEvent,
  OfferAcceptedEventFilter,
  OfferCanceledEvent,
  OfferCanceledEventFilter,
  OfferCreatedEvent,
  OfferCreatedEventFilter,
  OfferRejectedEvent,
  OfferRejectedEventFilter,
} from "./typechain/Curation";
import { IMartToken, TransferEvent, TransferEventFilter } from "./typechain/IMartToken";

export type State = {
  // buy_event_excuted_offset: bigint;
  // list_event_excuted_offset: bigint;
  // delist_event_excuted_offset: bigint;
  // create_offer_excuted_offset: bigint;
  // accept_offer_excuted_offset: bigint;
  // cancel_offer_excuted_offset: bigint;
  create_token_excuted_offset: bigint;
  gallery_create_excuted_offset: bigint;
  exhibit_list_excuted_offset: bigint;
  exhibit_cancel_excuted_offset: bigint;
  exhibit_freeze_excuted_offset: bigint;
  exhibit_redeem_excuted_offset: bigint;
  exhibit_buy_excuted_offset: bigint;
  curation_offer_create_excuted_offset: bigint;
  curation_offer_accept_excuted_offset: bigint;
  curation_offer_reject_excuted_offset: bigint;
  curation_offer_cancel_excuted_offset: bigint;
};

export type StateFlow = Subject<State>

export type Event =
  | TransferEvent
  | OfferCreatedEvent
  | OfferAcceptedEvent
  | OfferRejectedEvent
  | OfferCanceledEvent
  | ExhibitListedEvent
  | ExhibitCanceledEvent
  | ExhibitFrozenEvent
  | ExhibitRedeemedEvent
  | ExhibitSoldEvent;

export type EventFilter =
  | TransferEventFilter
  | OfferCreatedEventFilter
  | OfferAcceptedEventFilter
  | OfferRejectedEventFilter
  | OfferCanceledEventFilter
  | ExhibitListedEventFilter
  | ExhibitCanceledEventFilter
  | ExhibitFrozenEventFilter
  | ExhibitRedeemedEventFilter
  | ExhibitSoldEventFilter;

export type Contract = 
  | IMartToken
  | Curation;
