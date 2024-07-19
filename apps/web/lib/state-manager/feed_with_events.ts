import {
  BuyTicketEvent,
  GetRewardEvent,
  ProduceResultEvent,
  RefundEvent,
  PStateManager,
  getNullifierId,
  ReduceEvent,
  BLOCK_PER_ROUND,
} from 'l1-lottery-contracts';

import { Field } from 'o1js';

interface LotteryContractEvent {
  'buy-ticket': typeof BuyTicketEvent;
  'produce-result': typeof ProduceResultEvent;
  'get-reward': typeof GetRewardEvent;
  'get-refund': typeof RefundEvent;
  reduce: typeof ReduceEvent;
}

interface MinaEventTransactionInfo {
  transactionHash: string;
  transactionStatus: string;
  transactionMemo: string;
}

interface MinaEvent {
  data: any;
  transactionInfo: MinaEventTransactionInfo;
}

export interface BaseMinaEvent extends Document {
  _id: string;
  type:
    | 'buy-ticket'
    | 'produce-result'
    | 'get-reward'
    | 'get-refund'
    | 'reduce';
  event: MinaEvent;
  blockHeight: number;
  blockHash: string;
  parentBlockHash: string;
  globalSlot: number;
  chainStatus: string;
}

export async function syncWithEvents(
  stateM: PStateManager,
  startBlock: number,
  roundId: number,
  events: BaseMinaEvent[],
  lotteryContractEvents: LotteryContractEvent
): Promise<PStateManager> {
  stateM.syncWithCurBlock(Number(startBlock) + roundId * BLOCK_PER_ROUND + 1);
  console.log('Sync with', startBlock, roundId);

  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const dataRaw = lotteryContractEvents[event.type].fromJSON(
      event.event.data as undefined as any
    );

    if (event.type == 'buy-ticket') {
      const data = dataRaw as BuyTicketEvent;
      console.log('Buy ticket', data.ticket, 'in round' + data.round);

      stateM.addTicket(data.ticket, +data.round, false);
    }
    if (event.type == 'produce-result') {
      const data = dataRaw as ProduceResultEvent;
      console.log('Produced result', data.result, 'round' + data.round);

      stateM.roundResultMap.set(data.round, data.result);
    }
    if (event.type == 'get-reward') {
      const data = dataRaw as GetRewardEvent;

      console.log('Got reward', data.ticket, 'round' + data.round);

      let ticketId = 0;
      let roundTicketWitness;

      for (; ticketId < stateM.lastTicketInRound[data.round]; ticketId++) {
        if (
          stateM.roundTicketMap[data.round]
            .get(Field(ticketId))
            .equals(data.ticket.hash())
            .toBoolean()
        ) {
          roundTicketWitness = stateM.roundTicketMap[data.round].getWitness(
            Field.from(ticketId)
          );
          break;
        }
      }

      stateM.ticketNullifierMap.set(
        getNullifierId(Field.from(data.round), Field.from(ticketId)),
        Field(1)
      );
    }

    if (event.type == 'reduce') {
      const data = dataRaw as ReduceEvent;
      console.log('Reduce: ', event.event.data);
      let fromActionState = data.startActionState;
      let endActionState = data.endActionState;

      let actions = await stateM.contract.reducer.fetchActions({
        fromActionState,
        endActionState,
      });

      actions.flat(1).map((action) => {
        stateM.addTicket(action.ticket, +action.round, true);

        if (stateM.processedTicketData.round == +action.round) {
          stateM.processedTicketData.ticketId++;
        } else {
          stateM.processedTicketData.ticketId = 0;
          stateM.processedTicketData.round = +action.round;
        }
      });
    }
  }

  return stateM;
}
