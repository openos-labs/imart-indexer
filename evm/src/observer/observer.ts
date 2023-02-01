import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { TypedEvent } from "../typechain/common";
import { State } from "../types";

export abstract class Observer {
  async processAll<T extends TypedEvent>(
    state: State,
    events: T[]
  ): Promise<State> {
    if (events.length == 0) return state;
    let current_state = state;
    console.info(
      `[Observer]: received events from block no ${events[0].blockNumber} to ${
        events[events.length - 1].blockNumber
      }: ${events}`
    );
    for (const event of events) {
      try {
        let { state: new_state, success } = await this.process(
          current_state,
          event
        );
        if (!success) return current_state;
        current_state = new_state;
      } catch (e) {
        console.error(e);
      }
      return current_state;
    }
  }

  abstract process<T extends TypedEvent>(
    state: State,
    event: T
  ): Promise<{ success: boolean; state: State }>;
}

export function processEvents<T extends TypedEvent>(
  state: State,
  events: T[],
  observer: Observer
): Promise<State> {
  return observer.processAll(state, events);
}

export function handleError(e: any) {
  let msg: string;
  if (e instanceof PrismaClientKnownRequestError) {
    msg = `${e.code}: ${JSON.stringify(e.meta)}`;
  } else {
    msg = e.toString();
  }
  console.error(msg);
}
