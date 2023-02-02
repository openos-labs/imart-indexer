import { CONTRACT_CURATION } from "../../config";
import { prisma } from "../../io";
import { TypedEvent } from "../../typechain/common";
import { GalleryCreatedEvent } from "../../typechain/Curation";
import { State } from "../../types";
import { handleError, Observer } from "../observer";

export class GalleryCreatedObserver extends Observer {
  async processAll<T extends TypedEvent>(
    state: State,
    events: T[]
  ): Promise<State> {
    const newEvents = events.filter(
      (e) => e.blockNumber > Number(state.gallery_create_excuted_offset)
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
      collection,
      tokenId,
      owner,
      spaceType,
      name,
      metadataUri,
      isToken,
      timestamp,
    ] = (event as GalleryCreatedEvent).args;

    const createGallery = prisma.curationGallery.create({
      data: {
        index: id.toBigInt(),
        root: CONTRACT_CURATION,
        owner,
        spaceType,
        name,
        metadataUri,
      },
    });

    const updateState = prisma.eventOffset.update({
      where: {
        id: 1,
      },
      data: {
        gallery_create_excuted_offset: blockNo,
      },
    });
    try {
      const [_, updatedState] = await prisma.$transaction([
        createGallery,
        updateState,
      ]);
      if (updatedState.gallery_create_excuted_offset != blockNo) {
        return { success: false, state };
      }
      const newState = {
        ...state,
        gallery_create_excuted_offset: blockNo,
      };
      return { success: true, state: newState };
    } catch (e) {
      handleError(e);
      return { success: false, state };
    }
  }
}