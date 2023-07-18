import { Subject } from "rxjs";
import {
  MultipleCollective,
  SingleCollective,
  Curation,
  Lottery,
} from "./typechain";

export type State = {
  single_collective_created_excuted_offset: bigint;
  multiple_collective_created_excuted_offset: bigint;
  gallery_excuted_offset: bigint;
  exhibit_excuted_offset: bigint;
  curation_offer_excuted_offset: bigint;
  lottery_excuted_offset: bigint;
};

export type StateFlow = Subject<State>;

export type Contract =
  | MultipleCollective
  | SingleCollective
  | Curation
  | Lottery;
