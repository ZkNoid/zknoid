import 'reflect-metadata';

import { type ClientAppChain } from '@proto-kit/sdk';
import { PublicKey } from 'o1js';
import { useCallback, useContext, useEffect } from 'react';
import { create } from 'zustand';

import { immer } from 'zustand/middleware/immer';

import { useNetworkStore } from './network';
import { useProtokitChainStore } from './protokitChain';
import AppChainClientContext from '../contexts/AppChainClientContext';

import { DefaultRuntimeModules } from '../runtimeModules';
import { Balances, ProtoUInt64, ZNAKE_TOKEN_ID } from 'zknoid-chain-dev';

import { BalancesKey } from '@proto-kit/library';
import { api } from '@/trpc/react';
import { getEnvContext } from '../envContext';

export interface BalancesState {
  loading: boolean;
  balances: {
    // address - balance
    [key: string]: bigint;
  };
  loadBalance: (
    client: ClientAppChain<typeof DefaultRuntimeModules, any, any, any>,
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
      client: ClientAppChain<typeof DefaultRuntimeModules, any, any, any>,
      address: string
    ) {
      set((state) => {
        state.loading = true;
      });

      const balance = await client.query.runtime.Balances.balances.get(
        // @ts-ignore
        new BalancesKey({
          tokenId: ZNAKE_TOKEN_ID,
          address: PublicKey.fromBase58(address),
        })
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
  client?: ClientAppChain<typeof DefaultRuntimeModules, any, any, any>;
}) => {
  const chain = useProtokitChainStore();
  const network = useNetworkStore();
  const balances = useProtokitBalancesStore();
  useEffect(() => {
    if (!network.protokitClientStarted) return;
    if (!network.walletConnected) return;
    if (!network.address) return;
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
      if (!network.address) return false;
      if (balancesStore.balances[network.address] >= amount) return false;

      bridgeStore.setOpen(amount);
      console.log('Setting open', amount);
      return true;
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
  ) as ClientAppChain<typeof DefaultRuntimeModules, any, any, any>;
  const logTestBalanceRecevied =
    api.logging.logTestBalanceRecevied.useMutation();

  return useCallback(async () => {
    if (!network.address) return;
    if (balancesStore.balances[network.address] >= 100 * 10 ** 9) return;

    const balances = contextAppChainClient.runtime.resolve(
      'Balances'
    ) as Balances;
    const sender = PublicKey.fromBase58(network.address!);

    console.log(balances);

    const l2tx = await contextAppChainClient.transaction(sender, () => {
      balances.addBalance(
        ZNAKE_TOKEN_ID,
        sender,
        ProtoUInt64.from(defaultBalance)
      );
    });

    await l2tx.sign();
    await l2tx.send();

    await logTestBalanceRecevied.mutateAsync({
      userAddress: network.address!,
      envContext: getEnvContext(),
    });
  }, [network.walletConnected, balancesStore.balances]);
};
