import { Curation__factory } from "./typechain";
import { TypedEvent, TypedEventFilter } from "./typechain/common";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Contract, State, StateFlow } from "./types";
import { events, eventStream } from "./subject";
import { delay } from "./utils/delay";
import { Subject } from "rxjs";
import {
  processEvents,
  ExhibitCanceledObserver,
  ExhibitFrozenObserver,
  ExhibitListedObserver,
  ExhibitRedeemedObserver,
  ExhibitSoldObserver,
  Observer,
  OfferAcceptedObserver,
  OfferCanceledObserver,
  OfferCreatedObserver,
  OfferRejectedObserver,
} from "./observer";

import { GalleryCreatedObserver } from "./observer/curation/gallery_created";
import { prisma } from "./io";
import { ALCHEMY_API, CONTRACT_CURATION, DURATION_SECS } from "./config";

const restPeriod = Number(DURATION_SECS);

async function main() {
  await curationWorkers();
}

async function worker<T extends TypedEvent, F extends TypedEventFilter<T>>(
  contract: Contract,
  eventFilter: F,
  observer: Observer,
  offsetField: string
) {
  const stateFlow: StateFlow = new Subject<State>();
  const stream = eventStream<T>();
  stateFlow.subscribe(async (state) => {
    await fireEvents<T, F>(
      contract,
      eventFilter,
      stream,
      {
        ...state,
      },
      offsetField
    );
  });
  stream.subscribe(async ({ state, events }) => {
    stateFlow.next(await processEvents(state, events, observer));
  });
  stateFlow.next(await initialState());
}

async function fireEvents<T extends TypedEvent, F extends TypedEventFilter<T>>(
  contract: Contract,
  eventFilter: F,
  eventStream: Subject<{
    state: State;
    events: T[];
  }>,
  state: State,
  offsetField: string
) {
  await delay(restPeriod);
  const blockNo = state[offsetField] as bigint;
  eventStream.next({
    state,
    events: await events<T, F>(contract, eventFilter, Number(blockNo)),
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function initialState(): Promise<State> {
  const execution = await prisma.eventOffset.findUnique({
    where: { id: 1 },
  });
  if (!execution) {
    throw new Error("Missing initial state");
  }
  const {
    create_token_excuted_offset,
    curation_offer_accept_excuted_offset,
    curation_offer_cancel_excuted_offset,
    curation_offer_reject_excuted_offset,
    curation_offer_create_excuted_offset,
    exhibit_buy_excuted_offset,
    exhibit_list_excuted_offset,
    exhibit_redeem_excuted_offset,
    exhibit_freeze_excuted_offset,
    exhibit_cancel_excuted_offset,
    gallery_create_excuted_offset,
  } = execution;
  return {
    create_token_excuted_offset,
    curation_offer_accept_excuted_offset,
    curation_offer_cancel_excuted_offset,
    curation_offer_reject_excuted_offset,
    curation_offer_create_excuted_offset,
    exhibit_buy_excuted_offset,
    exhibit_list_excuted_offset,
    exhibit_redeem_excuted_offset,
    exhibit_freeze_excuted_offset,
    exhibit_cancel_excuted_offset,
    gallery_create_excuted_offset,
  };
}

async function curationWorkers() {
  const provider = new JsonRpcProvider(ALCHEMY_API);
  const Curation = Curation__factory.connect(CONTRACT_CURATION, provider);

  await worker(
    Curation,
    Curation.filters.GalleryCreated(),
    new GalleryCreatedObserver(),
    "gallery_create_excuted_offset"
  );
  await worker(
    Curation,
    Curation.filters.OfferCreated(),
    new OfferCreatedObserver(),
    "curation_offer_create_excuted_offset"
  );
  await worker(
    Curation,
    Curation.filters.OfferAccepted(),
    new OfferAcceptedObserver(),
    "curation_offer_accept_excuted_offset"
  );
  await worker(
    Curation,
    Curation.filters.OfferCanceled(),
    new OfferCanceledObserver(),
    "curation_offer_cancel_excuted_offset"
  );
  await worker(
    Curation,
    Curation.filters.OfferRejected(),
    new OfferRejectedObserver(),
    "curation_offer_reject_excuted_offset"
  );
  await worker(
    Curation,
    Curation.filters.ExhibitFrozen(),
    new ExhibitFrozenObserver(),
    "exhibit_freeze_excuted_offset"
  );
  await worker(
    Curation,
    Curation.filters.ExhibitListed(),
    new ExhibitListedObserver(),
    "exhibit_list_excuted_offset"
  );
  await worker(
    Curation,
    Curation.filters.ExhibitRedeemed(),
    new ExhibitRedeemedObserver(),
    "exhibit_redeem_excuted_offset"
  );
  await worker(
    Curation,
    Curation.filters.ExhibitSold(),
    new ExhibitSoldObserver(),
    "exhibit_buy_excuted_offset"
  );
  await worker(
    Curation,
    Curation.filters.ExhibitCanceled(),
    new ExhibitCanceledObserver(),
    "exhibit_cancel_excuted_offset"
  );
}
