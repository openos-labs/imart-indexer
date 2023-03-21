import { CONTRACT_CURATION } from "../../config";
import { prisma } from "../../io";
import { TypedEvent } from "../../typechain/common";
import { GalleryChangedEvent } from "../../typechain/Curation";
import { State } from "../../types";
import { handleError, Observer } from "../observer";

export class GalleryObserver extends Observer {
  async processAll<T extends TypedEvent>(
    state: State,
    events: T[]
  ): Promise<State> {
    const newEvents = events.filter(
      (e) => e.blockNumber > Number(state.gallery_excuted_offset)
    );
    return super.processAll(state, newEvents);
  }
  async process<T extends TypedEvent>(
    state: State,
    event: T
  ): Promise<{ success: boolean; state: State }> {
    const blockNo = BigInt(event.blockNumber);
    const [
      id,
      eventType,
      collection,
      tokenId,
      owner,
      spaceType,
      name,
      metadataUri,
      isToken,
      timestamp,
      payees,
      rates,
      commissionPool,
    ] = (event as GalleryChangedEvent).args;

    const commissionRates = payees.reduce((acc, key, i) => {
      return { ...acc, [key]: rates[i].toString() };
    }, {});
    const createGallery = prisma.curationGallery.create({
      data: {
        index: id.toBigInt(),
        root: CONTRACT_CURATION,
        chain: "ETH",
        owner,
        spaceType,
        name,
        metadataUri,
        commissionRates,
        commissionPool,
      },
    });

    const updateState = prisma.eventOffset.update({
      where: {
        id: 1,
      },
      data: {
        gallery_excuted_offset: blockNo,
      },
    });
    try {
      const [_, updatedState] = await prisma.$transaction([
        createGallery,
        updateState,
      ]);
      if (updatedState.gallery_excuted_offset != blockNo) {
        return { success: false, state };
      }
      const newState = {
        ...state,
        gallery_excuted_offset: blockNo,
      };
      return { success: true, state: newState };
    } catch (e) {
      handleError(e);
      return { success: false, state };
    }
  }
}
