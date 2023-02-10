import { NotificationType, Prisma } from "@prisma/client";
import { CONTRACT_CURATION } from "../../config";
import { prisma } from "../../io";
import { TypedEvent } from "../../typechain/common";
import { OfferCreatedEvent } from "../../typechain/Curation";
import { State } from "../../types";
import { handleError, Observer } from "../observer";

export class OfferCreatedObserver extends Observer {
  async processAll<T extends TypedEvent>(
    state: State,
    events: T[]
  ): Promise<State> {
    const newEvents = events.filter(
      (e) => e.blockNumber > Number(state.curation_offer_create_excuted_offset)
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
      commissionFeerate,
      offerStartAt,
      offerExpiredAt,
      exhibitDuration,
      url,
      detail,
    ] = (event as OfferCreatedEvent).args;
    const startAt = new Date(offerStartAt.toNumber() * 1000);
    const createOffer = prisma.curationOffer.upsert({
      where: {
        index_root: {
          index: id.toBigInt(),
          root: CONTRACT_CURATION,
        },
      },
      create: {
        index: id.toBigInt(),
        chain: "ETHEREUM",
        root: CONTRACT_CURATION,
        galleryIndex: galleryId.toBigInt(),
        collection,
        tokenCreator: "",
        tokenName: tokenId.toString(),
        propertyVersion: 0,
        source: from,
        destination: to,
        price: price.toString(),
        commissionFeeRate: commissionFeerate.toString(),
        currency: "0x0000000000000000000000000000000000000000",
        decimals: 18,
        offerStartAt: startAt,
        offerExpiredAt: new Date(offerExpiredAt.toNumber() * 1000),
        exhibitDuration: exhibitDuration.toNumber(),
        url,
        detail,
        status: "pending",
        updatedAt: startAt,
      },
      update: {},
    });
    const updateOffset = prisma.eventOffset.update({
      where: {
        id: 1,
      },
      data: {
        curation_offer_create_excuted_offset: blockNo,
      },
    });
    const notify = prisma.notification.upsert({
      where: {
        receiver_type_timestamp: {
          receiver: to,
          type: NotificationType.CurationOfferReceived,
          timestamp: startAt,
        },
      },
      create: {
        receiver: to,
        title: "You have received an offer",
        content: "From Mixverse",
        image: "",
        type: NotificationType.CurationOfferReceived,
        unread: true,
        timestamp: startAt,
        detail: {
          chain: "ETHEREUM",
          root: CONTRACT_CURATION,
          index: galleryId.toString(),
        } as Prisma.JsonObject,
      },
      update: {},
    });
    try {
      const [, updatedState] = await prisma.$transaction([
        createOffer,
        updateOffset,
        notify,
      ]);
      if (updatedState.curation_offer_create_excuted_offset != blockNo) {
        return { success: false, state };
      }
      const newState = {
        ...state,
        curation_offer_create_excuted_offset: blockNo,
      };
      return { success: true, state: newState };
    } catch (e) {
      handleError(e);
      return { success: false, state };
    }
  }
}
