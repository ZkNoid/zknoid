import { useContext, useEffect } from 'react';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { ALL_NETWORKS, NETWORKS } from '@/app/constants/networks';

import { useChainStore } from './minaChain';
import { useNetworkStore } from './network';

import ZkNoidGameContext from '../contexts/ZkNoidGameContext';
import { fetchAccount } from 'o1js';

export interface BalancesState {
  loading: boolean;
  balances: {
    // address - balance
    [key: string]: bigint;
  };
  loadBalance: (networkID: string, address: string) => Promise<void>;
}

export interface BalanceQueryResponse {
  data: {
    account:
      | {
          balance: {
            total: string;
          };
        }
      | undefined;
  };
}

export const useMinaBalancesStore = create<
  BalancesState,
  [['zustand/immer', never]]
>(
  immer((set) => ({
    loading: Boolean(false),
    balances: {},
    async loadBalance(networkID: string, address: string) {
      set((state) => {
        state.loading = true;
      });

      const account = await fetchAccount({ publicKey: address });

      const balance = BigInt(account.account?.balance.toBigInt() ?? 0n);

      console.log('Balance fetching', balance);

      set((state) => {
        state.loading = false;
        state.balances[address] = balance ?? 0n;
      });
    },
  }))
);

export const useObserveMinaBalance = () => {
  const chain = useChainStore();
  const balances = useMinaBalancesStore();
  const network = useNetworkStore();

  useEffect(() => {
    if (
      !network.walletConnected ||
      !network.address ||
      !network.minaNetwork?.networkID
    )
      return;

    balances.loadBalance(network.minaNetwork?.networkID!, network.address!);
  }, [
    chain.block?.height,
    network.walletConnected,
    network.minaNetwork?.networkID,
    network.address,
  ]);
};
