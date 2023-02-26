import {
  Curation__factory,
  SingleCollective__factory,
  MultipleCollective__factory,
} from "./typechain";
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
  SingleCollectiveCreateObserver,
  MultipleCollectiveCreateObserver,
} from "./observer";

import { GalleryCreatedObserver } from "./observer/curation/gallery_created";
import { prisma } from "./io";
import {
  CONTRACT_CURATION,
  CONTRACT_MULTIPLE_COLLECTIVE,
  CONTRACT_SINGLE_COLLECTIVE,
  DURATION_MILLIS,
  PROVIDER_ENDPOINT_1,
  PROVIDER_ENDPOINT_2,
  PROVIDER_ENDPOINT_3,
} from "./config";

const restPeriod = Number(DURATION_MILLIS);
const provider_1 = new JsonRpcProvider(PROVIDER_ENDPOINT_1);
const provider_2 = new JsonRpcProvider(PROVIDER_ENDPOINT_2);
const provider_3 = new JsonRpcProvider(PROVIDER_ENDPOINT_3);

async function main() {
  await creationWorkers();
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
    creation_collection_created_excuted_offset,
    creation_token_created_excuted_offset,
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
    single_collective_created_excuted_offset,
    multiple_collective_created_excuted_offset,
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
    creation_token_created_excuted_offset,
    creation_collection_created_excuted_offset,
    single_collective_created_excuted_offset,
    multiple_collective_created_excuted_offset,
  };
}

async function creationWorkers() {
  const SingleCollective = SingleCollective__factory.connect(
    CONTRACT_SINGLE_COLLECTIVE,
    provider_1
  );
  await worker(
    SingleCollective,
    SingleCollective.filters.CollectionCreated(),
    new SingleCollectiveCreateObserver(),
    "single_collective_created_excuted_offset"
  );

  const MultipleCollective = MultipleCollective__factory.connect(
    CONTRACT_MULTIPLE_COLLECTIVE,
    provider_1
  );
  await worker(
    MultipleCollective,
    MultipleCollective.filters.CollectionCreated(),
    new MultipleCollectiveCreateObserver(),
    "multiple_collective_created_excuted_offset"
  );
}

async function curationWorkers() {
  const CurationA = Curation__factory.connect(CONTRACT_CURATION, provider_2);
  const CurationB = Curation__factory.connect(CONTRACT_CURATION, provider_3);

  await worker(
    CurationA,
    CurationA.filters.GalleryCreated(),
    new GalleryCreatedObserver(),
    "gallery_create_excuted_offset"
  );
  await worker(
    CurationA,
    CurationA.filters.OfferCreated(),
    new OfferCreatedObserver(),
    "curation_offer_create_excuted_offset"
  );
  await worker(
    CurationA,
    CurationA.filters.OfferAccepted(),
    new OfferAcceptedObserver(),
    "curation_offer_accept_excuted_offset"
  );
  await worker(
    CurationA,
    CurationA.filters.OfferCanceled(),
    new OfferCanceledObserver(),
    "curation_offer_cancel_excuted_offset"
  );
  await worker(
    CurationA,
    CurationA.filters.OfferRejected(),
    new OfferRejectedObserver(),
    "curation_offer_reject_excuted_offset"
  );
  await worker(
    CurationB,
    CurationB.filters.ExhibitFrozen(),
    new ExhibitFrozenObserver(),
    "exhibit_freeze_excuted_offset"
  );
  await worker(
    CurationB,
    CurationB.filters.ExhibitListed(),
    new ExhibitListedObserver(),
    "exhibit_list_excuted_offset"
  );
  await worker(
    CurationB,
    CurationB.filters.ExhibitRedeemed(),
    new ExhibitRedeemedObserver(),
    "exhibit_redeem_excuted_offset"
  );
  await worker(
    CurationB,
    CurationB.filters.ExhibitSold(),
    new ExhibitSoldObserver(),
    "exhibit_buy_excuted_offset"
  );
  await worker(
    CurationB,
    CurationB.filters.ExhibitCanceled(),
    new ExhibitCanceledObserver(),
    "exhibit_cancel_excuted_offset"
  );
}
