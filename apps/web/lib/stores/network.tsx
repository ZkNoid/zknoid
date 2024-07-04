'use client';
import { type PendingTransaction } from '@proto-kit/sequencer';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { ALL_NETWORKS, Network } from '@/app/constants/networks';
import { requestAccounts } from '../helpers';

export interface NetworkState {
  minaNetwork: Network | undefined;
  setNetwork: (network: Network | undefined) => Promise<void>;
  address: string | undefined;
  walletConnected: boolean;
  protokitClientStarted: boolean;
  onWalletConnected: (address: string | undefined) => Promise<void>;
  onProtokitClientStarted: () => void;
  connectWallet: (soft: boolean) => Promise<void>;
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
    async setNetwork(network: Network | undefined) {
      const O1js = await import('o1js');

      set((state) => {
        console.log('Target network', network);
        state.minaNetwork = network;
        if (network) {
          const Network = O1js.Mina.Network({
            mina: network?.graphql,
            archive: network?.archive,
          });
          O1js.Mina.setActiveInstance(Network);
        }
      });
    },
    address: undefined,
    async onWalletConnected(address: string | undefined) {
      if (address) {
        localStorage.minaAdderess = address;
        let minaNetwork;
        if (window.mina?.isPallad) {
          try {
            console.log('Fetching chain id');

            const network = await window.mina.request({
              method: 'mina_chainId',
            });
            console.log('Wallet network', network);

            minaNetwork = ALL_NETWORKS.find(
              (x) => x.palladNetworkID == network.result
            );
            console.log('Connecting to mina network', minaNetwork);
          } catch (e) {
            console.log('Error while wallet connect');
            console.log('Error while wallet connect', e);
          }
        } else {
          const network = await (window as any).mina.requestNetwork();
          minaNetwork = ALL_NETWORKS.find((x) =>
            network.networkID != 'unknown'
              ? x.networkID == network.networkID
              : x.name == network.name
          );
        }

        this.setNetwork(minaNetwork);
      } else {
        localStorage.minaAdderess = '';
      }
      set((state) => {
        state.address = address;
        state.walletConnected = !!address;
      });
    },
    async connectWallet(soft: boolean) {
      if (soft) {
        if (localStorage.minaAdderess) {
          this.onWalletConnected(localStorage.minaAdderess);
          return this.onWalletConnected(localStorage.minaAdderess);
        }
      } else {
        const accounts = await requestAccounts();
        this.onWalletConnected(accounts[0]);
      }
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
