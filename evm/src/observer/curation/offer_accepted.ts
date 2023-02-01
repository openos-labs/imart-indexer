import { TypedEvent } from "../../typechain/common";
import { State } from "../../types";
import { Observer } from "../observer";

export class OfferAcceptedObserver extends Observer {
  async processAll<T extends TypedEvent>(
    state: State,
    events: T[]
  ): Promise<State> {
    return super.processAll(state, events);
  }
  process<T extends TypedEvent>(
    state: State,
    event: T
  ): Promise<{ success: boolean; state: State }> {
    throw new Error("Method not implemented.");
  }
}
