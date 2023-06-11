import { Chain, NotificationType, Prisma, PrismaPromise } from "@prisma/client";
import { randomUUID } from "crypto";
import { CHAIN, CONTRACT_CURATION, EVENTOFFSET_ID } from "../../config";
import { prisma } from "../../io";
import { redis } from "../../io/redis";
import { TypedEvent } from "../../typechain/common";
import { OfferChangedEvent } from "../../typechain/Curation";
import { State } from "../../types";
import { handleError, Observer } from "../observer";

const eventToStatus = {
  OfferCreated: "pending",
  OfferCanceled: "canceled",
  OfferRejected: "rejected",
  OfferAccepted: "accepted",
};
export class OfferObserver extends Observer {
  async processAll<T extends TypedEvent>(
    state: State,
    events: T[]
  ): Promise<State> {
    const newEvents = events.filter(
      (e) => e.blockNumber > Number(state.curation_offer_excuted_offset)
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
      collectionId,
      tokenId,
      from,
      to,
      price,
      galleryId,
      offerStartAt,
      offerExpiredAt,
      exhibitDuration,
      url,
      detail,
      timestamp,
    ] = (event as OfferChangedEvent).args;
    const updatedAt = new Date(timestamp.toNumber() * 1000);
    const startAt = new Date(offerStartAt.toNumber() * 1000);
    const expiredAt = new Date(offerExpiredAt.toNumber() * 1000);
    const createOffer = prisma.curationOffer.upsert({
      where: {
        index_root: {
          index: id.toBigInt(),
          root: CONTRACT_CURATION,
        },
      },
      create: {
        index: id.toBigInt(),
        chain: CHAIN as Chain,
        root: CONTRACT_CURATION,
        galleryIndex: galleryId.toBigInt(),
        collectionIdentifier: collectionId,
        tokenCreator: "",
        tokenIdentifier: tokenId.toString(),
        propertyVersion: 0,
        source: from,
        destination: to,
        price: price.toString(),
        currency: "0x0000000000000000000000000000000000000000",
        decimals: 18,
        offerStartAt: startAt,
        offerExpiredAt: expiredAt,
        exhibitDuration: exhibitDuration.toNumber(),
        url,
        detail,
        status: eventToStatus[eventType],
        updatedAt,
      },
      update: {
        collectionIdentifier: collectionId,
        tokenIdentifier: tokenId.toString(),
        status: eventToStatus[eventType],
      },
    });
    const updateOffset = prisma.eventOffset.update({
      where: {
        id: +EVENTOFFSET_ID,
      },
      data: {
        curation_offer_excuted_offset: blockNo,
      },
    });

    let receiver: string;
    let notificationType: NotificationType;
    let title: string;
    let notificationDetail: any;
    switch (eventType) {
      case "OfferCreated":
        title = "You have received an offer";
        receiver = to;
        notificationType = NotificationType.CurationOfferReceived;
        notificationDetail = {
          chain: CHAIN as Chain,
          collectionId,
          tokenId: tokenId.toString(),
        };
        break;
      case "OfferAccepted":
        title = "Your offer has been accepted";
        receiver = from;
        notificationType = NotificationType.CurationOfferAccepted;
        notificationDetail = {
          chain: CHAIN as Chain,
          collectionId,
          tokenId: tokenId.toString(),
        };
        break;
      case "OfferRejected":
        title = "Your offer has been rejected";
        receiver = from;
        notificationType = NotificationType.CurationOfferRejected;
        notificationDetail = {
          chain: CHAIN as Chain,
          collectionId,
          tokenId: tokenId.toString(),
        };
        break;
    }

    const notification = {
      id: randomUUID(),
      receiver,
      title,
      content: "From Mixverse",
      image: "",
      type: notificationType,
      unread: true,
      timestamp: updatedAt,
      detail: notificationDetail,
    };

    let tx: PrismaPromise<any>[] = [createOffer, updateOffset];
    let data = { ...notification, timestamp: updatedAt.getMilliseconds() };
    if (this.needNotify(eventType)) {
      redis.LPUSH(
        `imart:notifications:${receiver.toLowerCase()}`,
        JSON.stringify(data)
      );
      const notify = prisma.notification.upsert({
        where: {
          receiver_type_timestamp: {
            receiver,
            type: notificationType,
            timestamp: updatedAt,
          },
        },
        create: {
          ...notification,
          detail: notificationDetail as Prisma.JsonObject,
        },
        update: {},
      });
      tx.push(notify);
    }

    try {
      const [, updatedState] = await prisma.$transaction(tx);
      if (updatedState.curation_offer_excuted_offset != blockNo) {
        return { success: false, state };
      }
      const newState = {
        ...state,
        curation_offer_excuted_offset: blockNo,
      };
      return { success: true, state: newState };
    } catch (e) {
      handleError(e);
      return { success: false, state };
    }
  }

  needNotify(eventType: string): boolean {
    return (
      eventType === "OfferCreated" ||
      eventType === "OfferAccepted" ||
      eventType === "OfferRejected"
    );
  }
}
