import { PublicKey, UInt64 } from 'o1js';
import { useContext, useEffect } from 'react';
import { useProtokitChainStore } from '@/lib/stores/protokitChain';
import { useNetworkStore } from '@/lib/stores/network';
import ZkNoidGameContext from '@/lib/contexts/ZkNoidGameContext';
import { randzuConfig } from '../config';
import { type ClientAppChain } from '@proto-kit/sdk';
import {
  MatchQueueState,
  matchQueueInitializer,
} from '@/lib/stores/matchQueue';
import { create } from 'zustand';

export const useRandzuMatchQueueStore = create<
  MatchQueueState,
  [['zustand/immer', never]]
>(matchQueueInitializer);

export const useObserveRandzuMatchQueue = () => {
  const chain = useProtokitChainStore();
  const network = useNetworkStore();
  const matchQueue = useRandzuMatchQueueStore();
  const { client } = useContext(ZkNoidGameContext);

  const client_ = client as ClientAppChain<
    typeof randzuConfig.runtimeModules,
    any,
    any,
    any
  >;

  useEffect(() => {
    if (
      !network.walletConnected ||
      !network.address ||
      !chain.block?.height ||
      !network.protokitClientStarted
    ) {
      return;
    }

    if (!client) {
      throw Error('Context app chain client is not set');
    }

    matchQueue.loadMatchQueue(
      client_.query.runtime.RandzuLogic,
      chain.block?.height
    );
    matchQueue.loadActiveGame(
      client_.query.runtime.RandzuLogic,
      chain.block?.height,
      PublicKey.fromBase58(network.address!)
    );
  }, [
    chain.block?.height,
    network.walletConnected,
    network.address,
    network.protokitClientStarted,
  ]);
};
