'use client'
import { NETWORKS, Network } from "@/app/constants/networks";
import { PendingTransaction } from "@proto-kit/sequencer";
import { Mina } from "o1js";
import { client } from "zknoid-chain-dev";
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

  pendingL2Transactions: PendingTransaction[];
  addPendingL2Transaction: (pendingTransaction: PendingTransaction) => void;
  removePendingL2Transaction: (pendingTransaction: PendingTransaction) => void;

}

export const useNetworkStore = create<NetworkState, [["zustand/immer", never]]>(
  immer((set) => ({
    minaNetwork: undefined,
    async setNetwork(chainId: string) {
      set((state) => {
        const minaNetwork = NETWORKS.find(x => x.chainId == chainId);
        state.minaNetwork = minaNetwork;
        if (minaNetwork) {
          const Network = Mina.Network(minaNetwork?.graphql);
          Mina.setActiveInstance(Network);  
        }
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
    pendingL2Transactions: [],
    addPendingL2Transaction(pendingTransaction) {
      set((state) => {
        // @ts-ignore
        state.pendingL2Transactions.push(pendingTransaction);
      });
    },
    removePendingL2Transaction(pendingTransaction) {
      set((state) => {
        state.pendingL2Transactions = state.pendingL2Transactions.filter((tx) => {
          return tx.hash().toString() !== pendingTransaction.hash().toString();
        });
      });
    },
  })),
);
