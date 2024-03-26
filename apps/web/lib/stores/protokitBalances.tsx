import 'reflect-metadata';

import { ClientAppChain } from '@proto-kit/sdk';
import { PendingTransaction, UnsignedTransaction } from '@proto-kit/sequencer';
import { AccountUpdate, Mina, PublicKey, UInt64 } from 'o1js';
import { useCallback, useContext, useEffect } from 'react';
import { create } from 'zustand';

import { immer } from 'zustand/middleware/immer';

import { BRIDGE_ADDR } from '@/app/constants';

import { useNetworkStore } from './network';
import { useProtokitChainStore } from './protokitChain';
import AppChainClientContext from '../contexts/AppChainClientContext';

import { DefaultRuntimeModules } from '../runtimeModules';
import { zkNoidConfig } from '@/games/config';
import { ProtokitLibrary } from 'zknoid-chain-dev';

export interface BalancesState {
  loading: boolean;
  balances: {
    // address - balance
    [key: string]: bigint;
  };
  loadBalance: (
    client: ClientAppChain<typeof DefaultRuntimeModules>,
    address: string
  ) => Promise<void>;
}

export const useProtokitBalancesStore = create<
  BalancesState,
  [['zustand/immer', never]]
>(
  immer((set) => ({
    loading: Boolean(false),
    balances: {},
    async loadBalance(
      client: ClientAppChain<typeof DefaultRuntimeModules>,
      address: string
    ) {
      set((state) => {
        state.loading = true;
      });

      const balance = await client.query.runtime.Balances.balances.get(
        PublicKey.fromBase58(address)
      );

      set((state) => {
        state.loading = false;
        state.balances[address] = balance?.toBigInt() ?? BigInt(0);
      });
    },
  }))
);

export const useObserveProtokitBalance = ({
  client,
}: {
  client?: ClientAppChain<typeof DefaultRuntimeModules>;
}) => {
  const chain = useProtokitChainStore();
  const network = useNetworkStore();
  const balances = useProtokitBalancesStore();
  useEffect(() => {
    if (!network.protokitClientStarted) return;
    if (!network.walletConnected) return;
    if (!client) throw Error('Client is not set');

    balances.loadBalance(client, network.address!);
  }, [
    chain.block?.height,
    network.protokitClientStarted,
    network.walletConnected,
    network.address,
  ]);
};

export interface BridgeStoreState {
  open: boolean;
  amount: bigint;
  setOpen: (amount: bigint) => void;
  close: () => void;
}

export const useBridgeStore = create<
  BridgeStoreState,
  [['zustand/immer', never]]
>(
  immer((set) => ({
    open: false,
    amount: 0n,
    setOpen(amount) {
      set({
        open: true,
        amount,
      });
    },
    close() {
      set({
        open: false,
      });
    },
  }))
);

export const useMinaBridge = () => {
  const balancesStore = useProtokitBalancesStore();
  const network = useNetworkStore();
  const bridgeStore = useBridgeStore();

  return useCallback(
    async (amount: bigint) => {
      if (!network.address) return;
      if (balancesStore.balances[network.address] >= amount) return;

      bridgeStore.setOpen(amount);
      console.log('Setting open', amount);
      return;

      // const hash = (data as any).hash;
      // console.log('Tx hash', hash);

      // const balances = contextAppChainClient.runtime.resolve('Balances');
      // const sender = PublicKey.fromBase58(network.address!);

      // const l2tx = await contextAppChainClient.transaction(sender, () => {
      //   balances.addBalance(sender, UInt64.from(amount));
      // });

      // await l2tx.sign();
      // await l2tx.send();

      // isPendingTransaction(l2tx.transaction);

      // network.addPendingL2Transaction(l2tx!.transaction!);
    },
    [network.walletConnected, balancesStore.balances]
  );
};

export const useTestBalanceGetter = () => {
  const defaultBalance = 100 * 10 ** 9;
  const balancesStore = useProtokitBalancesStore();
  const network = useNetworkStore();
  const contextAppChainClient = useContext(
    AppChainClientContext
  ) as ClientAppChain<any> as ClientAppChain<typeof DefaultRuntimeModules>;

  return useCallback(async () => {
    if (!network.address) return;
    if (balancesStore.balances[network.address]) return;

    const balances = contextAppChainClient.runtime.resolve('Balances');
    const sender = PublicKey.fromBase58(network.address!);

    const l2tx = await contextAppChainClient.transaction(sender, () => {
      balances.addBalance(sender, ProtokitLibrary.UInt64.from(defaultBalance));
    });

    await l2tx.sign();
    await l2tx.send();
  }, [network.walletConnected, balancesStore.balances]);
};
