import { Chain, PrismaPromise } from "@prisma/client";
import {
  CHAIN,
  CONTRACT_CURATION,
  EVENTOFFSET_ID,
  KEY_COLLECTION_TOKENS,
  randomProvider,
} from "../../config";
import { prisma } from "../../io";
import { ERC721__factory } from "../../typechain";
import { TypedEvent } from "../../typechain/common";
import { ExhibitChangedEvent } from "../../typechain/Curation";
import { State } from "../../types";
import { handleError, Observer } from "../observer";
import { redis } from "../../io/redis";

const eventTypeToStatus = {
  ExhibitListed: "listing",
  ExhibitCanceled: "reserved",
  ExhibitSold: "sold",
  ExhibitFrozen: "frozen",
  ExhibitRedeemed: "redeemed",
};
export class ExhibitObserver extends Observer {
  async processAll<T extends TypedEvent>(
    state: State,
    events: T[],
    startBlockNo: number,
    endBlockNo: number
  ): Promise<State> {
    const newEvents = events.filter(
      (e) => e.blockNumber > Number(state.exhibit_excuted_offset)
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
    ] = (event as ExhibitChangedEvent).args;
    const updatedAt = new Date(timestamp.toNumber() * 1000);
    const exhibit = await prisma.curationExhibit.findFirst({
      where: {
        index: id.toBigInt(),
        root: CONTRACT_CURATION,
        status: {
          in: ["listing", "reserved"],
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    const updateExhibit = prisma.curationExhibit.upsert({
      where: {
        id: exhibit?.id || "",
      },
      create: {
        index: id.toBigInt(),
        chain: CHAIN as Chain,
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
        status: eventTypeToStatus[eventType],
        updatedAt,
      },
      update: {
        status: eventTypeToStatus[eventType],
        price: price.toString(),
        galleryIndex: galleryId.toBigInt(),
        origin,
        curator: origin,
        detail,
      },
    });
    const updateOffset = prisma.eventOffset.update({
      where: {
        id: +EVENTOFFSET_ID,
      },
      data: {
        exhibit_excuted_offset: blockNo,
      },
    });
    let owner: string;
    let txs: PrismaPromise<any>[] = [updateExhibit, updateOffset];
    if (eventType == "ExhibitSold") {
      owner = await ERC721__factory.connect(
        collection,
        randomProvider()
      ).ownerOf(tokenId);
      const updateTransaction = prisma.transaction.upsert({
        where: {
          chain_tokenId_collectionId_txType_txTimestamp: {
            chain: CHAIN as Chain,
            tokenId: tokenId.toString(),
            collectionId: collection,
            txType: "SALE",
            txTimestamp: updatedAt,
          },
        },
        create: {
          chain: CHAIN as Chain,
          tokenId: tokenId.toString(),
          collectionId: collection,
          galleryRoot: CONTRACT_CURATION,
          galleryIndex: galleryId.toBigInt(),
          exhibitRoot: CONTRACT_CURATION,
          exhibitIndex: id.toBigInt(),
          source: origin,
          destination: owner,
          amount: price.toString(),
          quantity: "1",
          currency: "0x0000000000000000000000000000000000000000",
          txHash: event.transactionHash,
          txType: "SALE",
          txTimestamp: updatedAt,
        },
        update: {
          txHash: event.transactionHash,
          txType: "SALE",
          txTimestamp: updatedAt,
        },
      });
      txs.push(updateTransaction);
    }

    try {
      const [_, updatedState] = await prisma.$transaction(txs);
      if (updatedState.exhibit_excuted_offset != blockNo) {
        return { success: false, state };
      }
      const newState = {
        ...state,
        exhibit_excuted_offset: blockNo,
      };
      if (eventType == "ExhibitSold" && owner) {
        const key = KEY_COLLECTION_TOKENS(CHAIN, collection);
        const token = await redis.HGET(key, tokenId.toString());
        const parsed = JSON.parse(token);
        parsed["owner"] = owner;
        parsed["ownership"] = [owner];
        await redis.HSET(key, tokenId.toString(), JSON.stringify(parsed));
      }
      return { success: true, state: newState };
    } catch (e) {
      handleError(e);
      return { success: false, state };
    }
  }
}
