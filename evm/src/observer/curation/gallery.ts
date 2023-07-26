import { Chain } from "@prisma/client";
import { CHAIN, CONTRACT_CURATION, EVENTOFFSET_ID } from "../../config";
import { prisma } from "../../io";
import { redis } from "../../io/redis";
import { TypedEvent } from "../../typechain/common";
import { GalleryChangedEvent } from "../../typechain/Curation";
import { State } from "../../types";
import { handleError, Observer } from "../observer";

export class GalleryObserver extends Observer {
  async processAll<T extends TypedEvent>(
    state: State,
    events: T[],
    startBlockNo: number,
    endBlockNo: number
  ): Promise<State> {
    const newEvents = events.filter(
      (e) => e.blockNumber > Number(state.gallery_excuted_offset)
    );
    return super.processAll(state, newEvents, startBlockNo, endBlockNo);
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
      metadataURI,
      isToken,
      timestamp,
      payees,
      rates,
      commissionPool,
      admissions,
    ] = (event as GalleryChangedEvent).args;

    const commissionRates = payees.reduce((acc, key, i) => {
      return { ...acc, [key]: rates[i].toString() };
    }, {});
    const createGallery = prisma.curationGallery.upsert({
      where: {
        index_root: {
          index: id.toBigInt(),
          root: CONTRACT_CURATION,
        },
      },
      create: {
        index: id.toBigInt(),
        root: CONTRACT_CURATION,
        chain: CHAIN as Chain,
        owner,
        spaceType,
        name,
        metadataURI,
        commissionRates,
        commissionPool,
        admissions: admissions.join(","),
      },
      update: {
        owner,
        spaceType,
        name,
        metadataURI,
        commissionRates,
        commissionPool,
        admissions: admissions.join(","),
      },
    });

    const updateState = prisma.eventOffset.update({
      where: {
        id: +EVENTOFFSET_ID,
      },
      data: {
        gallery_excuted_offset: blockNo,
      },
    });
    try {
      const [gallery, updatedState] = await prisma.$transaction([
        createGallery,
        updateState,
      ]);
      const response = await fetch(metadataURI);
      const metadata = await response.json();
      const galleryData = JSON.stringify({
        ...metadata,
        index: Number(gallery.index),
        root: CONTRACT_CURATION,
        chain: CHAIN as Chain,
        owner,
        spaceType,
        name,
        metadataURI,
        commissionRates,
        commissionPool,
        admissions: admissions.join(","),
      });
      redis.set(`mixverse:curation:${metadata.id}`, galleryData);
      redis.set(
        `mixverse:curation:${gallery.root}:${Number(gallery.index)}`,
        galleryData
      );
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
