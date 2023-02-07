import { Subject } from "rxjs";
import { MultipleCollective, SingleCollective, Curation } from "./typechain";

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
  creation_token_created_excuted_offset: bigint;
  creation_collection_created_excuted_offset: bigint;
  single_collective_created_excuted_offset: bigint;
  multiple_collective_created_excuted_offset: bigint;
};

export type StateFlow = Subject<State>;

export type Contract = MultipleCollective | SingleCollective | Curation;
