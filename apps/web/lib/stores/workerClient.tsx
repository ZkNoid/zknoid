'use client';
import { useCallback, useEffect, useMemo } from 'react';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import ZknoidWorkerClient from '@/worker/zknoidWorkerClient';
import { BLOCK_PER_ROUND } from 'l1-lottery-contracts';
import { NetworkIds } from '@/app/constants/networks';
import { LOTTERY_ADDRESS } from '@/app/constants/addresses';

export interface ClientState {
  status: string;
  client?: ZknoidWorkerClient;
  lotteryState: { currentRound: bigint; startBlock: bigint } | undefined;
  lotteryRoundId: number;
  start: () => Promise<ZknoidWorkerClient>;
  startLottery: (
    networkId: string,
    currBlock: number
  ) => Promise<ZknoidWorkerClient>;
  fetchOffchainState: (startBlock: number, roundId: number) => Promise<number>;
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
    amount: number
  ) => Promise<any>;
  offchainStateUpdateBlock: number;
}

export const useWorkerClientStore = create<
  ClientState,
  [['zustand/immer', never]]
>(
  immer((set) => ({
    status: 'Not loaded',
    lotteryState: undefined,
    lotteryRoundId: 0,
    offchainStateUpdateBlock: 0,
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
    async startLottery(networkId, currBlock) {
      set((state) => {
        state.status = 'Lottery loading';
      });

      await this.client!.waitFor();

      set((state) => {
        state.status = 'Lottery contracts loading';
      });

      const lotteryPublicKey58 = LOTTERY_ADDRESS[networkId];

      await this.client?.loadLotteryContract();

      await this.client?.initLotteryInstance(lotteryPublicKey58, networkId);

      set((state) => {
        state.status = 'Lottery state fetching';
      });

      const lotteryState = (await this.client?.getLotteryState()) as {
        currentRound: bigint;
        startBlock: bigint;
      };

      set((state) => {
        state.lotteryState = lotteryState;
      });

      const roundId = Math.floor(
        (currBlock - Number(lotteryState.startBlock)) / BLOCK_PER_ROUND
      );

      set((state) => {
        state.lotteryRoundId = roundId;
      });

      await this.client?.fetchOffchainState(
        Number(lotteryState.startBlock),
        roundId
      );

      set((state) => {
        state.offchainStateUpdateBlock = currBlock;
      });

      const offchainState = await this.client?.getRoundsInfo([roundId]);

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
    async getRoundsInfo(rounds: number[]) {
      return (await this.client?.getRoundsInfo(rounds)) as Record<
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
    },
    async fetchOffchainState(startBlock: number, roundId: number) {
      const lastOffchainUpdate = await this.client!.fetchOffchainState(
        startBlock,
        roundId
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
        (currBlock - Number(this.lotteryState?.startBlock!)) / BLOCK_PER_ROUND
      );

      await this.client?._call('buyTicket', {
        senderAccount,
        startBlock: this.lotteryState?.startBlock,
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
      amount: number
    ) {
      set((state) => {
        state.status = 'Get reward tx prepare';
      });

      await this.client?._call('getReward', {
        senderAccount,
        startBlock: this.lotteryState?.startBlock,
        roundId,
        ticketNums,
        amount,
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
