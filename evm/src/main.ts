import {
  Curation__factory,
  SingleCollective__factory,
  MultipleCollective__factory,
  SingleCollective,
  MultipleCollective,
  Curation,
  Lottery__factory,
  Lottery,
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
  CONTRACT_LOTTERY,
  CONTRACT_MULTIPLE_COLLECTIVE,
  CONTRACT_SINGLE_COLLECTIVE,
  DURATION_MILLIS,
  EVENTOFFSET_ID,
  randomProvider,
} from "./config";
import { redis } from "./io/redis";
import { LotteryObserver } from "./observer/lottery";

const restPeriod = Number(DURATION_MILLIS);

async function main() {
  redis.on("error", (err) => console.log("Redis Client Error", err));
  await redis.connect();
  await creationWorkers();
  await curationWorkers();
  await lotteryWorkers();
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
      state.offsetField
    );
  });
  stream.subscribe(async ({ state, events, startBlockNo, endBlockNo }) => {
    stateFlow.next(
      await processEvents(state, events, startBlockNo, endBlockNo, observer)
    );
  });
  stateFlow.next(await initialState(offsetField));
}

async function fireEvents<T extends TypedEvent, F extends TypedEventFilter<T>>(
  contract: Contract,
  eventFilter: F,
  eventStream: Subject<{
    state: State;
    events: T[];
    startBlockNo: number;
    endBlockNo: number;
  }>,
  state: State,
  offsetField: string
) {
  await delay(restPeriod);
  const blockNo = Number(state[offsetField] as bigint);
  const latestBlockNo = (await randomProvider().getBlock("latest")).number;
  const data = await events<T, F>(
    contract,
    eventFilter,
    blockNo,
    latestBlockNo
  );
  eventStream.next({ state, ...data });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function initialState(offsetField: string): Promise<State> {
  const execution = await prisma.eventOffset.findUnique({
    where: { id: parseInt(EVENTOFFSET_ID) },
  });
  if (!execution) {
    throw new Error("Missing initial state");
  }
  const {
    single_collective_created_excuted_offset,
    multiple_collective_created_excuted_offset,
    gallery_excuted_offset,
    exhibit_excuted_offset,
    curation_offer_excuted_offset,
    lottery_excuted_offset,
  } = execution;
  return {
    single_collective_created_excuted_offset,
    multiple_collective_created_excuted_offset,
    gallery_excuted_offset,
    exhibit_excuted_offset,
    curation_offer_excuted_offset,
    lottery_excuted_offset,
    offsetField,
  };
}

async function lotteryWorkers() {
  const newLottery = () =>
    Lottery__factory.connect(CONTRACT_LOTTERY, randomProvider());
  const newSingleCollectiveFilter = (c: Lottery) => c.filters.CreateActivity();
  await worker(
    newLottery,
    newSingleCollectiveFilter,
    new LotteryObserver(),
    "lottery_excuted_offset"
  );
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
