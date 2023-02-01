import { TypedEvent } from "../../typechain/common";
import { State } from "../../types";
import { Observer } from "../observer";

export class GalleryCreatedObserver extends Observer {
  async processAll<T extends TypedEvent>(
    state: State,
    events: T[]
  ): Promise<State> {
    return super.processAll(state, events);
  }
  async process<T extends TypedEvent>(
    state: State,
    event: T
  ): Promise<{ success: boolean; state: State }> {
    console.log("gallery created:", state);
    console.log(event);
    return { success: true, state };
  }
}
