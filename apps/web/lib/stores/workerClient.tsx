'use client';
import { useCallback, useEffect, useMemo } from 'react';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import ZknoidWorkerClient from '@/worker/zknoidWorkerClient';
import {
  BLOCK_PER_ROUND,
  Lottery,
  NumberPacked,
  StateManager,
  TICKET_PRICE,
  getNullifierId,
} from 'l1-lottery-contracts';
import { NetworkIds } from '@/app/constants/networks';
import { LOTTERY_ADDRESS } from '@/app/constants/addresses';
import { Field, PublicKey, UInt32, type JsonProof } from 'o1js';
import {
  BaseMinaEvent,
  syncWithEvents,
} from '../state-manager/feed_with_events';

export interface ClientState {
  status: string;
  client: ZknoidWorkerClient | undefined;
  onchainStateInitialized: boolean;
  offchainStateInitialized: boolean;
  lotteryCompiled: boolean;
  isActiveTx: boolean;
  onchainState:
    | {
        ticketRoot: Field;
        ticketNullifier: Field;
        bankRoot: Field;
        roundResultRoot: Field;
        startBlock: bigint;
      }
    | undefined;
  lotteryRoundId: number;
  start: () => Promise<ZknoidWorkerClient>;
  stateM: StateManager | undefined;
  lotteryGame: Lottery | undefined;

  startLottery: (
    networkId: string,
    currBlock: number,
    events: object[]
  ) => Promise<ZknoidWorkerClient>;
  updateOnchainState: () => Promise<void>;
  updateOffchainState: (currBlock: number, events: object[]) => Promise<void>;
  fetchOffchainState: (
    startBlock: number,
    roundId: number,
    events: object[]
  ) => Promise<number>;
  setOnchainState: (onchainState: {
    ticketRoot: Field;
    ticketNullifier: Field;
    bankRoot: Field;
    roundResultRoot: Field;
    startBlock: bigint;
  }) => Promise<void>;
  setRoundId: (roundId: number) => Promise<void>;
  getRoundsInfo(rounds: number[]): Promise<
    Record<
      number,
      {
        id: number;
        bank: bigint;
        tickets: {
          amount: bigint;
          numbers: number[];
          owner: string;
          claimed: boolean;
          funds: bigint;
        }[];
        winningCombination: number[] | undefined;
      }
    >
  >;
  buyTicket: (
    senderAccount: string,
    currBlock: number,
    ticketNums: number[],
    amount: number
  ) => Promise<any>;
  getReward: (
    senderAccount: string,
    currBlock: number,
    roundId: number,
    ticketNums: number[],
    amount: number,
    dp: JsonProof
  ) => Promise<any>;
  offchainStateUpdateBlock: number;
}

export const useWorkerClientStore = create<
  ClientState,
  [['zustand/immer', never]]
>(
  immer((set) => ({
    status: 'Not loaded',
    client: undefined,
    onchainStateInitialized: false,
    offchainStateInitialized: false,
    lotteryCompiled: false,
    isActiveTx: false,
    onchainState: undefined as
      | {
          ticketRoot: Field;
          ticketNullifier: Field;
          bankRoot: Field;
          roundResultRoot: Field;
          startBlock: bigint;
        }
      | undefined,
    lotteryRoundId: 0,
    offchainStateUpdateBlock: 0,
    stateM: undefined as StateManager | undefined,
    lotteryGame: undefined as Lottery | undefined,
    async start() {
      set((state) => {
        state.status = 'Loading worker';
      });

      const zkappWorkerClient = new ZknoidWorkerClient();

      await zkappWorkerClient.waitFor();

      set((state) => {
        state.status = 'Loading contracts';
      });

      await zkappWorkerClient.loadContracts();

      set((state) => {
        state.status = 'Compiling contracts';
      });

      // await zkappWorkerClient.compileContracts();

      set((state) => {
        state.status = 'Initializing zkapp';
      });

      await zkappWorkerClient.initZkappInstance(
        'B62qjTmjVvvXnYCWSiEc1eVAz8vWVzJUK4xtBu7oq5ZuNT7aqAnAVub'
      );

      set((state) => {
        state.status = 'Initialized';
        state.client = zkappWorkerClient;
      });

      return zkappWorkerClient;
    },
    async getRoundsInfo(rounds: number[]) {
      console.log('Round ids', rounds);
      const data = {} as Record<
        number,
        {
          id: number;
          bank: bigint;
          tickets: {
            amount: bigint;
            numbers: number[];
            owner: string;
            claimed: boolean;
            funds: bigint;
          }[];
          winningCombination: number[] | undefined;
        }
      >;

      const stateM = this.stateM!;

      const SCORE_COEFFICIENTS: bigint[] = [
        0n,
        90n,
        324n,
        2187n,
        26244n,
        590490n,
        31886460n,
      ];

      for (let i = 0; i < rounds.length; i++) {
        console.log('I', i);
        const roundId = rounds[i];

        const roundBank = stateM.roundTickets[roundId]
          .map((x) => x.amount.toBigInt() * TICKET_PRICE.toBigInt())
          .reduce((x, y) => x + y);

        const winningCombination = NumberPacked.unpackToBigints(
          stateM.roundResultMap.get(Field.from(roundId))
        )
          .map((v) => Number(v))
          .slice(0, 6);

        const ticketsShares = stateM.roundTickets[roundId].map((x) => {
          const ticketShares =
            SCORE_COEFFICIENTS[
              Array.from({ length: 6 }, (p, i) => i)
                .map((i) =>
                  Number(x.numbers[i].toBigint()) == winningCombination[i]
                    ? 1
                    : (0 as number)
                )

                .reduce((a, b) => a + b)
            ] * x.amount.toBigInt();

          return ticketShares;
        });

        const totalShares = ticketsShares.reduce((x, y) => x + y);

        data[roundId] = {
          id: roundId,
          bank: stateM.roundTickets[roundId]
            .map((x) => x.amount.toBigInt())
            .reduce((x, y) => x + y),
          tickets: stateM.roundTickets[roundId].map((x, i) => ({
            amount: x.amount.toBigInt(),
            numbers: x.numbers.map((x) => Number(x.toBigint())),
            owner: x.owner.toBase58(),
            claimed: stateM.ticketNullifierMap
              .get(getNullifierId(Field.from(roundId), Field.from(i)))
              .equals(Field.from(1))
              .toBoolean(),
            funds: (roundBank * ticketsShares[i]) / totalShares,
          })),
          winningCombination: winningCombination.every((x) => x == 0)
            ? undefined
            : winningCombination,
        };
      }
      return data;
    },
    async setOnchainState(onchainState) {
      set((state) => {
        // @ts-ignore
        state.onchainState = onchainState;
        state.offchainStateInitialized = true
      });
    },
    async setRoundId(roundId) {
      set((state) => {
        // @ts-ignore
        state.lotteryRoundId = roundId;
      });
    },
    async startLottery(networkId, currBlock, events) {
      set((state) => {
        state.status = 'Lottery loading';
      });

      await this.client!.waitFor();
      const lotteryPublicKey58 = LOTTERY_ADDRESS[networkId];

      set((state) => {
        state.status = 'Lottery state fetching';
      });

      await this.client?.initLotteryInstance(lotteryPublicKey58, networkId);

      const onchainState = this.onchainState!;

      console.log('Fetched state', this.onchainState);

      const roundId = Math.floor(
        (currBlock - Number(onchainState.startBlock)) / BLOCK_PER_ROUND
      );

      set((state) => {
        state.lotteryRoundId = roundId;
        state.status = 'State manager loading';
      });

      let stateM = new StateManager(
        UInt32.from(onchainState.startBlock).toFields()[0],
        true
      );

      const publicKey = PublicKey.fromBase58(lotteryPublicKey58);
      const lotteryGame = new Lottery(publicKey);

      set((state) => {
        state.status = 'Sync with events';
        state.lotteryGame = lotteryGame;
      });
      this.lotteryGame = lotteryGame;

      stateM = await syncWithEvents(
        stateM,
        Number(onchainState.startBlock),
        roundId,
        events as unknown as BaseMinaEvent[],
        lotteryGame.events
      )!;

      set((state) => {
        // @ts-ignore
        state.stateM = stateM;
      });

      this.stateM = stateM;

      await this.fetchOffchainState(
        Number(onchainState.startBlock),
        roundId,
        events
      );

      set((state) => {
        state.offchainStateUpdateBlock = currBlock;
      });

      set((state) => {
        state.status = 'Lottery prover cache downloading';
      });

      await this.client?.downloadLotteryCache();

      set((state) => {
        state.status = 'Distribution contracts compiling';
      });

      await this.client?.compileDistributionProof();

      set((state) => {
        state.status = 'Lottery contracts compiling';
      });

      await this.client?.compileLotteryContracts();

      set((state) => {
        state.lotteryCompiled = true;
        state.status = 'Lottery instance init';
      });

      set((state) => {
        state.status = 'Lottery initialized';
      });

      return this.client!;
    },
    async updateOnchainState() {
      set((state) => {
        state.status = 'Onchain state update';
      });

      this.client?.fetchOnchainState();

      set((state) => {
        state.onchainStateInitialized = true;
        state.status = 'Onchain state fetched';
      });
    },
    async updateOffchainState(currBlock, events) {
      set((state) => {
        state.status = 'Sync with events';
      });

      const onchainState = this.onchainState!;

      const roundId = Math.floor(
        (currBlock - Number(onchainState.startBlock)) / BLOCK_PER_ROUND
      );

      set((state) => {
        state.lotteryRoundId = roundId;
        state.status = 'State manager loading';
      });

      await this.fetchOffchainState(
        Number(onchainState.startBlock),
        roundId,
        events
      );

      set((state) => {
        state.offchainStateUpdateBlock = currBlock;
      });

      set((state) => {
        state.offchainStateInitialized = true;
        state.status = 'Lottery initialized';
      });
    },
    async fetchOffchainState(
      startBlock: number,
      roundId: number,
      events: object[]
    ) {
      let stateM = new StateManager(Field.from(startBlock), true);
      stateM = await syncWithEvents(
        stateM,
        startBlock,
        roundId,
        events as BaseMinaEvent[],
        this.lotteryGame!.events
      )!;

      set((state) => {
        // @ts-ignore
        state.stateM = stateM;
      });

      const lastOffchainUpdate = await this.client!.fetchOffchainState(
        startBlock,
        roundId,
        events
      );
      console.log('Last offchain update', lastOffchainUpdate);

      set((state) => {
        state.offchainStateUpdateBlock = lastOffchainUpdate!;
      });
      return lastOffchainUpdate;
    },
    async buyTicket(
      senderAccount: string,
      currBlock: number,
      ticketNums: number[],
      amount: number
    ) {
      set((state) => {
        state.status = 'Ticket buy tx prepare';
        state.isActiveTx = true;
      });

      const roundId = Math.floor(
        (currBlock - Number(this.onchainState?.startBlock!)) / BLOCK_PER_ROUND
      );

      await this.client?._call('buyTicket', {
        senderAccount,
        startBlock: this.onchainState?.startBlock,
        roundId,
        ticketNums,
        amount,
      });

      set((state) => {
        state.status = 'Ticket buy tx proving';
      });

      const txJson = await this.client?._call('proveBuyTicketTransaction', {});

      set((state) => {
        state.status = 'Ticket buy tx proved';
        state.isActiveTx = false;
      });

      return txJson;
    },
    async getReward(
      senderAccount: string,
      currBlock: number,
      roundId: number,
      ticketNums: number[],
      amount: number,
      dp: JsonProof
    ) {
      set((state) => {
        state.status = 'Get reward tx prepare';
        state.isActiveTx = true;
      });

      await this.client?._call('getReward', {
        senderAccount,
        startBlock: this.onchainState?.startBlock,
        roundId,
        ticketNums,
        amount,
        dp,
      });

      set((state) => {
        state.status = 'Get reward tx proving';
      });

      const txJson = await this.client?._call('proveGetRewardTransaction', {});

      set((state) => {
        state.status = 'Get reward tx proved';
      });

      return txJson;
    },
  }))
);

export const useRegisterWorkerClient = () => {
  const workerClientStore = useWorkerClientStore();

  useEffect(() => {
    if (workerClientStore.status == 'Not loaded') workerClientStore.start();
  }, []);
};
