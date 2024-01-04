'use client'
import { NETWORKS, Network } from "@/app/constants/networks";
import { client } from "zknoid-chain";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type Client = typeof client;

export interface NetworkState {
  minaNetwork: Network | undefined;
  setNetwork: (chainId: string) => Promise<void>;
  address: string | undefined;
  setAddress: (address: string | undefined) => Promise<void>;
  connectWallet: () => Promise<void>;
  walletInstalled: () => boolean;
}

export const useNetworkStore = create<NetworkState, [["zustand/immer", never]]>(
  immer((set) => ({
    minaNetwork: undefined,
    async setNetwork(chainId: string) {
      set((state) => {
        state.minaNetwork = NETWORKS.find(x => x.chainId == chainId);
      });
    },
    address: undefined,
    async setAddress(address: string | undefined) {
      set((state) => {
        state.address = address;
      });
    },
    async connectWallet() {
      const accounts = await (window as any).mina.requestAccounts();
      set((state) => {
        state.address = accounts[0];
      });
    },
    walletInstalled() {
      return typeof mina !== 'undefined';
    },
  })),
);
