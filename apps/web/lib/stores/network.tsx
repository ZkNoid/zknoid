'use client';
import { PendingTransaction } from '@proto-kit/sequencer';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { NETWORKS, Network } from '@/app/constants/networks';

export interface NetworkState {
  minaNetwork: Network | undefined;
  setNetwork: (chainId: string) => Promise<void>;
  address: string | undefined;
  walletConnected: boolean;
  protokitClientStarted: boolean;
  onWalletConnected: (address: string | undefined) => Promise<void>;
  onProtokitClientStarted: () => void;
  connectWallet: () => Promise<void>;
  walletInstalled: () => boolean;

  pendingL2Transactions: PendingTransaction[];
  addPendingL2Transaction: (pendingTransaction: PendingTransaction) => void;
  removePendingL2Transaction: (pendingTransaction: PendingTransaction) => void;
}

export const useNetworkStore = create<NetworkState, [['zustand/immer', never]]>(
  immer((set) => ({
    walletConnected: false,
    protokitClientStarted: false,
    minaNetwork: undefined,
    onProtokitClientStarted() {
      set({
        protokitClientStarted: true,
      });
    },
    async setNetwork(chainId: string) {
      const O1js = await import('o1js');

      set((state) => {
        const minaNetwork = NETWORKS.find((x) => x.chainId == chainId);
        state.minaNetwork = minaNetwork;
        if (minaNetwork) {
          const Network = O1js.Mina.Network(minaNetwork?.graphql);
          O1js.Mina.setActiveInstance(Network);
        }
      });
    },
    address: undefined,
    async onWalletConnected(address: string | undefined) {
      const network = await (window as any).mina.requestNetwork();
      this.setNetwork(network.chainId);
      set((state) => {
        state.address = address;
        state.walletConnected = true;
      });
    },
    async connectWallet() {
      const accounts = await (window as any).mina.requestAccounts();
      this.onWalletConnected(accounts[0]);
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
        state.pendingL2Transactions = state.pendingL2Transactions.filter(
          (tx) => {
            return (
              tx.hash().toString() !== pendingTransaction.hash().toString()
            );
          }
        );
      });
    },
  }))
);
