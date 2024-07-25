'use client';
import { useCallback, useEffect, useMemo } from 'react';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { performance } from 'perf_hooks';

import ZknoidWorkerClient from '@/worker/zknoidWorkerClient';
import {
  BLOCK_PER_ROUND,
  PLottery,
  NumberPacked,
  TICKET_PRICE,
  getNullifierId,
} from 'l1-lottery-contracts';
import { NetworkIds } from '@/app/constants/networks';
import { LOTTERY_ADDRESS } from '@/app/constants/addresses';
import { Field, PublicKey, UInt32, type JsonProof } from 'o1js';
import { DateTime, Duration } from 'luxon';

export interface ClientState {
  status: string;
  client: ZknoidWorkerClient | undefined;
  onchainStateInitialized: boolean;
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
  lotteryGame: PLottery | undefined;

  startLottery: (
    networkId: string,
    currBlock: number,
    events: object[]
  ) => Promise<ZknoidWorkerClient>;
  updateOnchainState: () => Promise<void>;
  setOnchainState: (onchainState: {
    ticketRoot: Field;
    ticketNullifier: Field;
    bankRoot: Field;
    roundResultRoot: Field;
    startBlock: bigint;
  }) => Promise<void>;
  setRoundId: (roundId: number) => Promise<void>;
  buyTicket: (
    senderAccount: string,
    currBlock: number,
    ticketNums: number[],
    amount: number
  ) => Promise<any>;
  getReward: (
    senderAccount: string,
    networkId: string,
    roundId: number,
    ticketNums: number[],
    amount: number
  ) => Promise<any>;
}

export const useWorkerClientStore = create<
  ClientState,
  [['zustand/immer', never]]
>(
  immer((set) => ({
    status: 'Not loaded',
    client: undefined,
    onchainStateInitialized: false,
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
    lotteryGame: undefined as PLottery | undefined,
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
      
      set((state) => {
        state.onchainStateInitialized = true;
      });

      console.log('Fetched state', this.onchainState);

      const roundId = Math.floor(
        (currBlock - Number(onchainState.startBlock)) / BLOCK_PER_ROUND
      );

      set((state) => {
        state.lotteryRoundId = roundId;
        state.status = 'State manager loading';
      });

      const publicKey = PublicKey.fromBase58(lotteryPublicKey58);
      const lotteryGame = new PLottery(publicKey);

      set((state) => {
        state.status = 'Sync with events';
        state.lotteryGame = lotteryGame;
      });

      set((state) => {
        state.status = 'Lottery prover cache downloading';
      });

      await this.client?.downloadLotteryCache();

      set((state) => {
        state.status = 'Reduce contracts compiling';
      });

      const t1 = Date.now() / 1000;

      await this.client?.compileReduceProof();

      set((state) => {
        state.status = 'Distribution contracts compiling';
      });

      const t2 = Date.now() / 1000;

      await this.client?.compileDistributionProof();

      set((state) => {
        state.status = 'Lottery contracts compiling';
      });

      const t3 = Date.now() / 1000;

      await this.client?.compileLotteryContracts();

      const t4 = Date.now() / 1000;

      set((state) => {
        state.lotteryCompiled = true;
      });

      const dt1 = (t2 - t1).toFixed(2);
      const dt2 = (t3 - t2).toFixed(2);
      const dt3 = (t4 - t3).toFixed(2);

      const msg = `Lottery compiled (${dt1}s, ${dt2}s, ${dt3}s)`;
      console.log(msg);

      set((state) => {
        state.status = msg;
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
      networkId: string,
      roundId: number,
      ticketNums: number[],
      amount: number
    ) {
      set((state) => {
        state.status = 'Get reward tx prepare';
        state.isActiveTx = true;
      });

      await this.client?._call('getReward', {
        networkId,
        senderAccount,
        startBlock: this.onchainState?.startBlock,
        roundId,
        ticketNums,
        amount,
      });

      set((state) => {
        state.status = 'Get reward tx proving';
      });

      const txJson = await this.client?._call('proveGetRewardTransaction', {});

      set((state) => {
        state.status = 'Get reward tx proved';
        state.isActiveTx = false;
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
