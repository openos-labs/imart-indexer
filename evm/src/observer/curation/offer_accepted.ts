import { NotificationType, Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import { CONTRACT_CURATION } from "../../config";
import { prisma } from "../../io";
import { redis } from "../../io/redis";
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
      collectionIdentifier,
      tokenId,
      from,
      to,
      price,
      galleryId,
      exhibitId,
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

    const updatedAt = new Date(timestamp.toNumber() * 1000);
    const createExhibit = prisma.curationExhibit.create({
      data: {
        index: exhibitId.toBigInt(),
        chain: "ETH",
        root: CONTRACT_CURATION,
        galleryIndex: galleryId.toBigInt(),
        curator: from,
        collectionIdentifier,
        tokenCreator: "",
        tokenIdentifier: tokenId.toString(),
        propertyVersion: 0,
        origin: to,
        price: price.toString(),
        currency: "0x0000000000000000000000000000000000000000",
        decimals: 18,
        expiredAt: new Date(exhibitExpiredAt.toNumber() * 1000),
        location: "",
        url: offer.url,
        detail: offer.detail,
        status: "reserved",
        updatedAt,
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
    const notification = {
      id: randomUUID(),
      receiver: from,
      title: "Your offer has been accepted",
      content: "From Mixverse",
      image: "",
      type: NotificationType.CurationOfferAccepted,
      unread: true,
      timestamp: updatedAt,
      detail: {
        chain: "ETH",
        collectionId: collectionIdentifier,
        tokenId: tokenId.toString(),
      },
    };
    redis.LPUSH(`imart:notifications:${from.toLowerCase()}`, JSON.stringify(notification));
    const notify = prisma.notification.upsert({
      where: {
        receiver_type_timestamp: {
          receiver: from,
          type: NotificationType.CurationOfferAccepted,
          timestamp: updatedAt,
        },
      },
      create: {
        ...notification,
        detail: {
          chain: "ETH",
          collectionId: collectionIdentifier,
          tokenId: tokenId.toString(),
        } as Prisma.JsonObject,
      },
      update: {},
    });
    try {
      const [offer, exhibit, updatedState] = await prisma.$transaction([
        updateOffer,
        createExhibit,
        updateOffset,
        notify,
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
