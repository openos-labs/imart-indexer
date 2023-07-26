import { EVENTOFFSET_ID } from "../../config";
import { prisma } from "../../io";
import { TypedEvent } from "../../typechain/common";
import { State } from "../../types";
import { handleError, Observer } from "..";
import { CreateActivityEvent } from "../../typechain/Lottery";

export class LotteryObserver extends Observer {
  async processAll<T extends TypedEvent>(
    state: State,
    events: T[],
    startBlockNo: number,
    endBlockNo: number
  ): Promise<State> {
    const newEvents = events.filter(
      (e) => e.blockNumber > Number(state.lottery_excuted_offset)
    );
    return super.processAll(state, newEvents, startBlockNo, endBlockNo);
  }
  async process<T extends TypedEvent>(
    state: State,
    event: T
  ): Promise<{ success: boolean; state: State }> {
    const blockNo = BigInt(event.blockNumber);
    const [
      organizer,
      activityId,
      nftContractAddress,
      tokenIds,
      endBlockNumber,
    ] = (event as CreateActivityEvent).args;
    const updateActivity = prisma.activityInfo.update({
      where: {
        activityId_organizer: {
          activityId: activityId.toString(),
          organizer,
        },
      },
      data: {
        status: 1,
      },
    });
    const updateState = prisma.eventOffset.update({
      where: {
        id: +EVENTOFFSET_ID,
      },
      data: {
        lottery_excuted_offset: blockNo,
      },
    });
    try {
      const [_, updatedState] = await prisma.$transaction([
        updateActivity,
        updateState,
      ]);
      if (updatedState.lottery_excuted_offset != blockNo) {
        return { success: false, state };
      }
      const newState = {
        ...state,
        lottery_excuted_offset: blockNo,
      };
      return { success: true, state: newState };
    } catch (e) {
      handleError(e);
      return { success: false, state };
    }
  }
}
