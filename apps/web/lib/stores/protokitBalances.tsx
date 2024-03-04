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

function isPendingTransaction(
  transaction: PendingTransaction | UnsignedTransaction | undefined
): asserts transaction is PendingTransaction {
  if (!(transaction instanceof PendingTransaction))
    throw new Error('Transaction is not a PendingTransaction');
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

export const useMinaBridge = () => {
  const balancesStore = useProtokitBalancesStore();
  const network = useNetworkStore();
  const contextAppChainClient = useContext(
    AppChainClientContext
  ) as ClientAppChain<any> as ClientAppChain<typeof DefaultRuntimeModules>;

  return useCallback(
    async (amount: number) => {
      if (!network.address) return;
      if (balancesStore.balances[network.address]) return;

      const l1tx = await Mina.transaction(() => {
        const senderUpdate = AccountUpdate.create(
          PublicKey.fromBase58(network.address!)
        );
        senderUpdate.requireSignature();
        console.log(BRIDGE_ADDR);
        console.log(amount);
        senderUpdate.send({ to: PublicKey.fromBase58(BRIDGE_ADDR), amount });
      });

      await l1tx.prove();

      const transactionJSON = l1tx.toJSON();

      const data = await (window as any).mina.sendPayment({
        transaction: transactionJSON,
        memo: 'Bridging to zknoid.io gaming platform',
        to: BRIDGE_ADDR,
        amount: amount / 10 ** 9,
      });

      const hash = (data as any).hash;
      console.log('Tx hash', hash);

      const balances = contextAppChainClient.runtime.resolve('Balances');
      const sender = PublicKey.fromBase58(network.address!);

      const l2tx = await contextAppChainClient.transaction(sender, () => {
        balances.addBalance(sender, UInt64.from(amount));
      });

      await l2tx.sign();
      await l2tx.send();

      isPendingTransaction(l2tx.transaction);

      network.addPendingL2Transaction(l2tx!.transaction!);
    },
    [network.walletConnected, balancesStore.balances]
  );
};
