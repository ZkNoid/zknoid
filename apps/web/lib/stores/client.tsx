'use client';
import { client } from 'zknoid-chain-dev';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ClientAppChain } from '@proto-kit/sdk';

export type Client = typeof client;

export interface ClientState {
  loading: boolean;
  client?: Client;
  start: () => Promise<Client>;
}

export const useClientStore = create<ClientState, [['zustand/immer', never]]>(
  immer((set) => ({
    loading: Boolean(false),
    async start() {
      set((state) => {
        state.loading = true;
      });

      await client.start();

      set((state) => {
        state.loading = false;
        // @ts-ignore
        state.client = client;
      });

      return client;
    },
  })),
);
