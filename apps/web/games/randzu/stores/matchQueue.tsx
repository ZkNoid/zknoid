import { PublicKey, UInt64 } from 'o1js';
import { useContext, useEffect } from 'react';
import { useProtokitChainStore } from '@/lib/stores/protokitChain';
import { useNetworkStore } from '@/lib/stores/network';
import AppChainClientContext from '@/lib/contexts/AppChainClientContext';
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
  const client = useContext<
    | ClientAppChain<typeof randzuConfig.runtimeModules, any, any, any>
    | undefined
  >(AppChainClientContext);

  useEffect(() => {
    if (!network.walletConnected || !network.address) {
      return;
    }

    if (!client) {
      throw Error('Context app chain client is not set');
    }

    matchQueue.loadMatchQueue(
      client.query.runtime.RandzuLogic,
      parseInt(chain.block?.height ?? '0')
    );
    matchQueue.loadActiveGame(
      client.query.runtime.RandzuLogic,
      parseInt(chain.block?.height ?? '0'),
      PublicKey.fromBase58(network.address!)
    );
  }, [chain.block?.height, network.walletConnected, network.address]);
};
