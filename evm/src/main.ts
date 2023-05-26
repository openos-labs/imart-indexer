import {
  Curation__factory,
  SingleCollective__factory,
  MultipleCollective__factory,
  SingleCollective,
  MultipleCollective,
  Curation,
} from "./typechain";
import {
  processEvents,
  ExhibitObserver,
  Observer,
  OfferObserver,
  SingleCollectiveCreateObserver,
  MultipleCollectiveCreateObserver,
} from "./observer";

import { TypedEvent, TypedEventFilter } from "./typechain/common";
import { Contract, State, StateFlow } from "./types";
import { events, eventStream } from "./subject";
import { delay } from "./utils/delay";
import { Subject } from "rxjs";
import { GalleryObserver } from "./observer/curation/gallery";
import { prisma } from "./io";
import {
  CONTRACT_CURATION,
  CONTRACT_MULTIPLE_COLLECTIVE,
  CONTRACT_SINGLE_COLLECTIVE,
  DURATION_MILLIS,
  EVENTOFFSET_ID,
  randomProvider,
} from "./config";
import { redis } from "./io/redis";

const restPeriod = Number(DURATION_MILLIS);

async function main() {
  redis.on("error", (err) => console.log("Redis Client Error", err));
  await redis.connect();
  await creationWorkers();
  await curationWorkers();
}

async function worker<T extends TypedEvent, F extends TypedEventFilter<T>>(
  newContract: () => Contract,
  newEventFilter: (contract: Contract) => F,
  observer: Observer,
  offsetField: string
) {
  const stateFlow: StateFlow = new Subject<State>();
  const stream = eventStream<T>();
  stateFlow.subscribe(async (state) => {
    const contract = newContract();
    const eventFilter = newEventFilter(contract);
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
    where: { id: parseInt(EVENTOFFSET_ID) },
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
    gallery_excuted_offset,
    exhibit_excuted_offset,
    curation_offer_excuted_offset,
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
    gallery_excuted_offset,
    exhibit_excuted_offset,
    curation_offer_excuted_offset,
  };
}

async function creationWorkers() {
  const newSingleCollective = () =>
    SingleCollective__factory.connect(
      CONTRACT_SINGLE_COLLECTIVE,
      randomProvider()
    );
  const newSingleCollectiveFilter = (c: SingleCollective) =>
    c.filters.CollectionCreated();
  await worker(
    newSingleCollective,
    newSingleCollectiveFilter,
    new SingleCollectiveCreateObserver(),
    "single_collective_created_excuted_offset"
  );

  const newMultipleCollective = () =>
    MultipleCollective__factory.connect(
      CONTRACT_MULTIPLE_COLLECTIVE,
      randomProvider()
    );
  const newMultipleCollectiveFilter = (c: MultipleCollective) =>
    c.filters.CollectionCreated();
  await worker(
    newMultipleCollective,
    newMultipleCollectiveFilter,
    new MultipleCollectiveCreateObserver(),
    "multiple_collective_created_excuted_offset"
  );
}

async function curationWorkers() {
  const newCuration = () =>
    Curation__factory.connect(CONTRACT_CURATION, randomProvider());
  const galleryChangedFilter = (c: Curation) => c.filters.GalleryChanged();
  const offerChangedFilter = (c: Curation) => c.filters.OfferChanged();
  const exhibitChangedFilter = (c: Curation) => c.filters.ExhibitChanged();

  await worker(
    newCuration,
    galleryChangedFilter,
    new GalleryObserver(),
    "gallery_excuted_offset"
  );
  await worker(
    newCuration,
    offerChangedFilter,
    new OfferObserver(),
    "curation_offer_excuted_offset"
  );
  await worker(
    newCuration,
    exhibitChangedFilter,
    new ExhibitObserver(),
    "exhibit_excuted_offset"
  );
}
