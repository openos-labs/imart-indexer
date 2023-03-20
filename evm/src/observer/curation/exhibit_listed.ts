import { CONTRACT_CURATION } from "../../config";
import { prisma } from "../../io";
import { TypedEvent } from "../../typechain/common";
import { ExhibitListedEvent } from "../../typechain/Curation";
import { State } from "../../types";
import { handleError, Observer } from "../observer";

export class ExhibitListedObserver extends Observer {
  async processAll<T extends TypedEvent>(
    state: State,
    events: T[]
  ): Promise<State> {
    const newEvents = events.filter(
      (e) => e.blockNumber > Number(state.exhibit_list_excuted_offset)
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
      galleryId,
      collection,
      tokenId,
      origin,
      expiration,
      price,
      _,
      url,
      detail,
      timestamp,
    ] = (event as ExhibitListedEvent).args;
    const createOffer = prisma.curationExhibit.upsert({
      where: {
        index_root: {
          index: id.toBigInt(),
          root: CONTRACT_CURATION,
        },
      },
      create: {
        index: id.toBigInt(),
        chain: "ETH",
        root: CONTRACT_CURATION,
        galleryIndex: galleryId.toBigInt(),
        curator: origin,
        collectionIdentifier: collection,
        tokenCreator: "",
        tokenIdentifier: tokenId.toString(),
        propertyVersion: 0,
        origin,
        price: price.toString(),
        currency: "0x0000000000000000000000000000000000000000",
        decimals: 18,
        expiredAt: new Date(expiration.toNumber() * 1000),
        location: "",
        url: url,
        detail: detail,
        status: "listing",
        updatedAt: new Date(timestamp.toNumber() * 1000),
      },
      update: {
        status: "listing",
      },
    });
    const updateOffset = prisma.eventOffset.update({
      where: {
        id: 1,
      },
      data: {
        exhibit_list_excuted_offset: blockNo,
      },
    });
    try {
      const [_, updatedState] = await prisma.$transaction([
        createOffer,
        updateOffset,
      ]);
      if (updatedState.exhibit_list_excuted_offset != blockNo) {
        return { success: false, state };
      }
      const newState = {
        ...state,
        exhibit_list_excuted_offset: blockNo,
      };
      return { success: true, state: newState };
    } catch (e) {
      handleError(e);
      return { success: false, state };
    }
  }
}
