import { CONTRACT_CURATION } from "../../config";
import { prisma } from "../../io";
import { TypedEvent } from "../../typechain/common";
import { OfferRejectedEvent } from "../../typechain/Curation";
import { State } from "../../types";
import { handleError, Observer } from "../observer";

export class OfferRejectedObserver extends Observer {
  async processAll<T extends TypedEvent>(
    state: State,
    events: T[]
  ): Promise<State> {
    const newEvents = events.filter(
      (e) => e.blockNumber > Number(state.curation_offer_reject_excuted_offset)
    );
    return super.processAll(state, newEvents);
  }
  async process<T extends TypedEvent>(
    state: State,
    event: T
  ): Promise<{ success: boolean; state: State }> {
    const blockNo = BigInt(event.blockNumber);
    const [id, _] = (event as OfferRejectedEvent).args;
    const createOffer = prisma.curationOffer.update({
      where: {
        index_root: {
          index: id.toBigInt(),
          root: CONTRACT_CURATION,
        },
      },
      data: {
        status: "rejected",
      },
    });
    const updateOffset = prisma.eventOffset.update({
      where: {
        id: 1,
      },
      data: {
        curation_offer_reject_excuted_offset: blockNo,
      },
    });
    try {
      const [_, updatedState] = await prisma.$transaction([
        createOffer,
        updateOffset,
      ]);
      if (updatedState.curation_offer_reject_excuted_offset != blockNo) {
        return { success: false, state };
      }
      const newState = {
        ...state,
        curation_offer_reject_excuted_offset: blockNo,
      };
      return { success: true, state: newState };
    } catch (e) {
      handleError(e);
      return { success: false, state };
    }
  }
}
