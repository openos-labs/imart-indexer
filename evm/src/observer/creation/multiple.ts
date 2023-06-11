import { Chain } from "@prisma/client";
import { CHAIN, EVENTOFFSET_ID } from "../../config";
import { prisma } from "../../io";
import { TypedEvent } from "../../typechain/common";
import { CollectionCreatedEvent } from "../../typechain/IMartCollective";
import { State } from "../../types";
import { handleError, Observer } from "../observer";

export class MultipleCollectiveCreateObserver extends Observer {
  async processAll<T extends TypedEvent>(
    state: State,
    events: T[]
  ): Promise<State> {
    const newEvents = events.filter(
      (e) =>
        e.blockNumber > Number(state.multiple_collective_created_excuted_offset)
    );
    return super.processAll(state, newEvents);
  }
  async process<T extends TypedEvent>(
    state: State,
    event: T
  ): Promise<{ success: boolean; state: State }> {
    const blockNo = BigInt(event.blockNumber);
    const [
      root,
      creator,
      name,
      category,
      tags,
      description,
      uri,
      payees,
      royalties,
      maximum,
    ] = (event as CollectionCreatedEvent).args;
    const royalty = payees.reduce((acc, key, i) => {
      return { ...acc, [key]: royalties[i].toString() };
    }, {});
    const createCollection = prisma.collection.upsert({
      where: {
        chain_creator_name: {
          chain: CHAIN as Chain,
          name,
          creator,
        },
      },
      create: {
        id: root,
        chain: CHAIN as Chain,
        metadataType: "IMAGE",
        category,
        tags: tags.join(","),
        name,
        creator,
        description,
        cover: "",
        logo: "",
        maximum: maximum.toString(),
        volume: "",
        floorPrice: "",
        uri,
        supply: "0",
        royalty,
        standard: 'ERC1155',
        root
      },
      update: {},
    });

    const updateState = prisma.eventOffset.update({
      where: {
        id: +EVENTOFFSET_ID,
      },
      data: {
        multiple_collective_created_excuted_offset: blockNo,
      },
    });
    try {
      const [_, updatedState] = await prisma.$transaction([
        createCollection,
        updateState,
      ]);
      if (updatedState.multiple_collective_created_excuted_offset != blockNo) {
        return { success: false, state };
      }
      const newState = {
        ...state,
        multiple_collective_created_excuted_offset: blockNo,
      };
      return { success: true, state: newState };
    } catch (e) {
      handleError(e);
      return { success: false, state };
    }
  }
}
