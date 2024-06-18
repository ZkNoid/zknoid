'use client';
import { useCallback, useEffect, useMemo } from 'react';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import ZknoidWorkerClient from '@/worker/zknoidWorkerClient';

export interface ClientState {
  status: string;
  client?: ZknoidWorkerClient;
  start: () => Promise<ZknoidWorkerClient>;
  startLottery: () => Promise<ZknoidWorkerClient>;
  buyTicket: (senderAccount: string, ticketNums: number[]) => Promise<undefined>;
}

export const useWorkerClientStore = create<
  ClientState,
  [['zustand/immer', never]]
>(
  immer((set) => ({
    status: 'Not loaded',
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
    async startLottery() {
      set((state) => {
        state.status = 'Lottery loading';
      });

      await this.client!.waitFor();

      set((state) => {
        state.status = 'Lottery contracts loading';
      });

      await this.client?._call('loadLotteryContract', {});

      set((state) => {
        state.status = 'Distribution contracts compiling';
      });

      await this.client?._call('compileDistributionProof', {});

      set((state) => {
        state.status = 'Lottery contracts compiling';
      });

      await this.client?._call('compileLotteryContracts', {});

      set((state) => {
        state.status = 'Lottery instance init';
      });

      const lotteryPublicKey58 = 'B62qjeggyBtmNuEhKgUXyQtnYXpDDipU5jUJDUrQCy24xGMBi8tU58f';

      await this.client?._call('initLotteryInstance', { lotteryPublicKey58 });

      set((state) => {
        state.status = 'Lottery initialized';
      });

      return this.client!;
    },
    async buyTicket(senderAccount: string, ticketNums: number[]) {
      set((state) => {
        state.status = 'Ticket buying';
      });

      await this.client?._call('buyTicket', { senderAccount, ticketNums });

      set((state) => {
        state.status = 'Ticket bought';
      });
    },
  }))
);

export const useRegisterWorkerClient = () => {
  const workerClientStore = useWorkerClientStore();

  useEffect(() => {
    if (workerClientStore.status == 'Not loaded') workerClientStore.start();
  }, []);
};
