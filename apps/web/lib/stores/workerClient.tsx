'use client';
import { useCallback, useEffect, useMemo } from 'react';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import ZknoidWorkerClient from '@/worker/zknoidWorkerClient';
import { BLOCK_PER_ROUND } from 'l1-lottery-contracts/build/src/constants';
import { NetworkIds } from '@/app/constants/networks';
import { LOTTERY_ADDRESS } from '@/app/constants/addresses';

export interface ClientState {
  status: string;
  client?: ZknoidWorkerClient;
  lotteryState: { currentRound: bigint; startBlock: bigint } | undefined;
  start: () => Promise<ZknoidWorkerClient>;
  startLottery: (networkId: string, currBlock: number) => Promise<ZknoidWorkerClient>;
  getRoundsInfo(rounds: number[]): Promise<Record<number, {
    id: number,
    bank: bigint,
    tickets: {
      amount: bigint,
      numbers: number[],
      owner: string
    }[],
    winningCombination: number[]
  }>>,
  buyTicket: (
    senderAccount: string,
    currBlock: number,
    ticketNums: number[],
    amount: number
  ) => Promise<any>;
  offchainStateReady: boolean;
}

export const useWorkerClientStore = create<
  ClientState,
  [['zustand/immer', never]]
>(
  immer((set) => ({
    status: 'Not loaded',
    lotteryState: undefined,
    offchainStateReady: false,
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

      const lotteryState = await this.client?.getLotteryState() as {
        currentRound: bigint;
        startBlock: bigint;
      };

      set((state) => {
        state.lotteryState = lotteryState 
      });

      const roundId = Math.floor(
        (currBlock - Number(lotteryState.startBlock)) / BLOCK_PER_ROUND
      );

      await this.client?.fetchOffchainState(Number(lotteryState.startBlock), roundId);

      set((state) => {
        state.offchainStateReady = true;
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
      return (await this.client?.getRoundsInfo(rounds)) as Record<number, {
        id: number,
        bank: bigint,
        tickets: {
          amount: bigint,
          numbers: number[],
          owner: string
        }[],
        winningCombination: number[]
      }>;
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
        amount
      });

      set((state) => {
        state.status = 'Ticket buy tx proving';
      });

      return await this.client?._call('proveBuyTicketTransaction', {});
    },
  }))
);

export const useRegisterWorkerClient = () => {
  const workerClientStore = useWorkerClientStore();

  useEffect(() => {
    if (workerClientStore.status == 'Not loaded') workerClientStore.start();
  }, []);
};
