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
  client?: ZknoidWorkerClient;
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
  startLottery: (
    networkId: string,
    currBlock: number,
    events: object[]
  ) => Promise<ZknoidWorkerClient>;
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
    onchainState: undefined,
    lotteryRoundId: 0,
    offchainStateUpdateBlock: 0,
    stateM: undefined,
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
          }[];
          winningCombination: number[] | undefined;
        }
      >;

      const stateM = this.stateM!;

      for (let i = 0; i < rounds.length; i++) {
        console.log('I', i);
        const roundId = rounds[i];

        const winningCombination = NumberPacked.unpackToBigints(
          stateM.roundResultMap.get(Field.from(roundId))
        )
          .map((v) => Number(v))
          .slice(0, 6);

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
      });

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

      await this.client?.fetchOffchainState(
        Number(onchainState.startBlock),
        roundId,
        events
      );

      set((state) => {
        state.offchainStateUpdateBlock = currBlock;
      });

      const offchainState = await this.getRoundsInfo([roundId]);

      console.log('Fetched offchain state', offchainState);

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

      await this.client?._call('compileLotteryContracts', {});

      set((state) => {
        state.status = 'Lottery instance init';
      });

      set((state) => {
        state.status = 'Lottery initialized';
      });

      return this.client!;
    },
    async updateLotteryState() {

    },
    async fetchOffchainState(
      startBlock: number,
      roundId: number,
      events: object[]
    ) {
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

      return await this.client?._call('proveBuyTicketTransaction', {});
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

      return await this.client?._call('proveGetRewardTransaction', {});
    },
  }))
);

export const useRegisterWorkerClient = () => {
  const workerClientStore = useWorkerClientStore();

  useEffect(() => {
    if (workerClientStore.status == 'Not loaded') workerClientStore.start();
  }, []);
};
