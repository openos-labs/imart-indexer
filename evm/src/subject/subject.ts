import { Subject } from "rxjs";
import { TypedEvent, TypedEventFilter } from "../typechain/common";
import { State, Contract } from "../types";

export function eventStream<T extends TypedEvent>(): Subject<{
  state: State;
  events: T[];
}> {
  return new Subject<{ state: State; events: T[] }>();
}

export async function events<
  T extends TypedEvent,
  F extends TypedEventFilter<T>
>(contract: Contract, filter: F, blockNo: number) {
  const events = await contract.queryFilter(filter, blockNo);
  return events as T[];
}
