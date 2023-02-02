import { CONTRACT_CURATION } from "../../config";
import { prisma } from "../../io";
import { TypedEvent } from "../../typechain/common";
import { OfferAcceptedEvent } from "../../typechain/Curation";
import { State } from "../../types";
import { handleError, Observer } from "../observer";

export class OfferAcceptedObserver extends Observer {
  async processAll<T extends TypedEvent>(
    state: State,
    events: T[]
  ): Promise<State> {
    const newEvents = events.filter(
      (e) => e.blockNumber > Number(state.curation_offer_accept_excuted_offset)
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
      from,
      to,
      price,
      galleryId,
      commissionFeeRate,
      exhibitExpiredAt,
      timestamp,
    ] = (event as OfferAcceptedEvent).args;

    const offer = await prisma.curationOffer.findUnique({
      where: {
        index_root: {
          index: id.toBigInt(),
          root: CONTRACT_CURATION,
        },
      },
    });

    const updateOffer = prisma.curationOffer.update({
      where: {
        index_root: {
          index: id.toBigInt(),
          root: CONTRACT_CURATION,
        },
      },
      data: {
        status: "accepted",
      },
    });

    const createExhibit = prisma.curationExhibit.create({
      data: {
        index: id.toBigInt(),
        root: CONTRACT_CURATION,
        galleryIndex: galleryId.toBigInt(),
        curator: from,
        collection,
        tokenCreator: "",
        tokenName: tokenId.toString(),
        propertyVersion: 0,
        origin: to,
        price: price.toString(),
        commissionFeeRate: commissionFeeRate.toString(),
        currency: "",
        decimals: 18,
        expiredAt: new Date(exhibitExpiredAt.toNumber() * 1000),
        location: "",
        url: offer.url,
        detail: offer.detail,
        status: "reserved",
        updatedAt: new Date(timestamp.toNumber() * 1000),
      },
    });

    const updateOffset = prisma.eventOffset.update({
      where: {
        id: 1,
      },
      data: {
        curation_offer_accept_excuted_offset: blockNo,
      },
    });
    try {
      const [offer, exhibit, updatedState] = await prisma.$transaction([
        updateOffer,
        createExhibit,
        updateOffset,
      ]);
      if (
        !offer ||
        !exhibit ||
        blockNo != updatedState.curation_offer_accept_excuted_offset
      ) {
        return { success: false, state };
      }
      const newState = {
        ...state,
        curation_offer_accept_excuted_offset: blockNo,
      };
      return { success: true, state: newState };
    } catch (e) {
      handleError(e);
      return { success: false, state };
    }
  }
}
