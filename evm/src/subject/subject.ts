import { Subject } from "rxjs";
import { handleError } from "../observer";
import { TypedEvent, TypedEventFilter } from "../typechain/common";
import { State, Contract } from "../types";

export function eventStream<T extends TypedEvent>(): Subject<{
  state: State;
  events: T[];
  startBlockNo: number;
  endBlockNo: number;
}> {
  return new Subject<{
    state: State;
    events: T[];
    startBlockNo: number;
    endBlockNo: number;
  }>();
}

export async function events<
  T extends TypedEvent,
  F extends TypedEventFilter<T>
>(
  contract: Contract,
  filter: F,
  startBlockNo: number,
  endBlockNo: number
): Promise<{ events: T[]; startBlockNo: number; endBlockNo: number }> {
  try {
    const events = (await contract.queryFilter(
      filter,
      startBlockNo,
      endBlockNo
    )) as T[];
    return { events, startBlockNo, endBlockNo };
  } catch (e) {
    handleError(e);
    return { events: [], startBlockNo, endBlockNo: startBlockNo };
  }
}
