'use client';

import 'reflect-metadata';

import { type ClientAppChain } from '@proto-kit/sdk';
import { Bool, Field, PrivateKey, PublicKey, Struct } from 'o1js';
import { useCallback, useContext, useEffect } from 'react';
import { create } from 'zustand';

import { immer } from 'zustand/middleware/immer';

import { useNetworkStore } from './network';
import { useProtokitChainStore } from './protokitChain';
import ZkNoidGameContext from '../contexts/ZkNoidGameContext';

import { DefaultRuntimeModules } from '../runtimeModules';
import { Balances, ProtoUInt64, ZNAKE_TOKEN_ID } from 'zknoid-chain-dev';

import { BalancesKey, TokenId } from '@proto-kit/library';
import { api } from '@/trpc/react';
import { getEnvContext } from '../envContext';
import { useBridgeStore } from '@/lib/stores/bridgeStore';

class Point extends Struct({ x: Field, y: Field }) {
  static add(a: Point, b: Point) {
    return { x: a.x.add(b.x), y: a.y.add(b.y) };
  }
}

class BalancesKey1 extends Struct({
  tokenId: TokenId,
  address: PublicKey,
}) {
  public static from(tokenId: TokenId, address: PublicKey) {
    //@ts-ignore
    return new BalancesKey({ tokenId, address });
  }
}

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

      const key = BalancesKey.from(
        TokenId.from(777),
        PrivateKey.random().toPublicKey()
      );

      const point1 = { x: Field(10), y: Field(4) };
      const point2 = { x: Field(1), y: Field(2) };

      const pointSum = Point.add(point1, point2);

      console.log(`pointSum Fields: ${Point.toFields(pointSum)}`);

      console.log(
        'Bug',
        TokenId.toFields(key.tokenId),
        PublicKey.toFields(key.address)
      );
      console.log('Bug1', BalancesKey1.toFields(key));
      // console.log('Bug2', BalancesKey.toFields(key));

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

export const useObserveProtokitBalance = () => {
  const chain = useProtokitChainStore();
  const network = useNetworkStore();
  const balances = useProtokitBalancesStore();
  const { client } = useContext(ZkNoidGameContext);

  useEffect(() => {
    if (!network.protokitClientStarted) return;
    if (!network.walletConnected) return;
    if (!network.address) return;
    if (!client) return;

    balances.loadBalance(client, network.address!);
  }, [
    chain.block?.height,
    network.protokitClientStarted,
    network.walletConnected,
    network.address,
  ]);
};

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
    [network.walletConnected, network.address, balancesStore.balances]
  );
};

export const useTestBalanceGetter = () => {
  const defaultBalance = 100 * 10 ** 9;
  const balancesStore = useProtokitBalancesStore();
  const network = useNetworkStore();

  const {client: contextAppChainClient} = useContext(ZkNoidGameContext);

  const client_ = contextAppChainClient as ClientAppChain<
    typeof DefaultRuntimeModules,
    any,
    any,
    any
  >;
  const logTestBalanceRecevied =
    api.logging.logTestBalanceRecevied.useMutation();

  return useCallback(async () => {
    if (!network.address) return;
    if (balancesStore.balances[network.address] >= 100 * 10 ** 9) return;

    const balances = client_.runtime.resolve(
      'Balances'
    ) as Balances;
    const sender = PublicKey.fromBase58(network.address!);

    console.log(balances);

    const l2tx = await client_.transaction(sender, async () => {
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
