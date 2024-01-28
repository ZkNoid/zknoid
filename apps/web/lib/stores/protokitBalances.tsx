import { create } from 'zustand';
import { Client, useClientStore } from './client';
import { immer } from 'zustand/middleware/immer';
import { PendingTransaction, UnsignedTransaction } from '@proto-kit/sequencer';
import { AccountUpdate, Mina, PublicKey, UInt64 } from 'o1js';
import { useCallback, useEffect } from 'react';
import { useProtokitChainStore } from './protokitChain';
import { BRIDGE_ADDR } from '@/app/constants';
import { useNetworkStore } from './network';

export interface BalancesState {
  loading: boolean;
  balances: {
    // address - balance
    [key: string]: bigint;
  };
  loadBalance: (client: Client, address: string) => Promise<void>;
}

function isPendingTransaction(
  transaction: PendingTransaction | UnsignedTransaction | undefined,
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
    async loadBalance(client: Client, address: string) {
      set((state) => {
        state.loading = true;
      });

      const balance = await client.query.runtime.Balances.balances.get(
        PublicKey.fromBase58(address),
      );

      set((state) => {
        state.loading = false;
        state.balances[address] = balance?.toBigInt() ?? BigInt(0);
      });
    },
  })),
);

export const useObserveProtokitBalance = () => {
  const client = useClientStore();
  const chain = useProtokitChainStore();
  const network = useNetworkStore();
  const balances = useProtokitBalancesStore();

  useEffect(() => {
    if (!client.client || !network.address) return;

    balances.loadBalance(client.client, network.address);
  }, [client.client, chain.block?.height, network.address]);
};

export const useMinaBridge = () => {
  const client = useClientStore();
  const balancesStore = useProtokitBalancesStore();
  const network = useNetworkStore();

  return useCallback(
    async (amount: number) => {
      if (!client.client || !network.address) return;
      if (balancesStore.balances[network.address]) return;

      /*
      const l1tx = await Mina.transaction(() => {
        let senderUpdate = AccountUpdate.create(
          PublicKey.fromBase58(network.address!),
        );
        senderUpdate.requireSignature();
        console.log(BRIDGE_ADDR);
        console.log(amount);
        senderUpdate.send({ to: PublicKey.fromBase58(BRIDGE_ADDR), amount });
      });

      await l1tx.prove();

      const transactionJSON = l1tx.toJSON();

      await (window as any).mina.sendTransaction({
        transaction: transactionJSON,
        feePayer: {
          fee: 0.1,
          memo: 'zknoid.io',
        },
      });
      */

      const balances = client.client.runtime.resolve('Balances');
      const sender = PublicKey.fromBase58(network.address!);

      const l2tx = await client.client.transaction(sender, () => {
        balances.addBalance(sender, UInt64.from(amount));
      });

      await l2tx.sign();
      await l2tx.send();

      isPendingTransaction(l2tx.transaction);

      network.addPendingL2Transaction(l2tx!.transaction!);
    },
    [client.client, network.address, balancesStore.balances],
  );
};
