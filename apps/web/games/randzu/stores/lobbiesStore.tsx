import { PublicKey, UInt64 } from 'o1js';
import { useContext, useEffect } from 'react';
import { useProtokitChainStore } from '@/lib/stores/protokitChain';
import { useNetworkStore } from '@/lib/stores/network';
import AppChainClientContext from '@/lib/contexts/AppChainClientContext';
import { randzuConfig } from '../config';
import { type ClientAppChain } from '@proto-kit/sdk';

import { create } from 'zustand';
import { LobbiesState, lobbyInitializer } from '@/lib/stores/lobbiesStore';

export const useRandzuLobbiesStore = create<
  LobbiesState,
  [['zustand/immer', never]]
>(lobbyInitializer);

export const useObserveRandzuLobbiesStore = () => {
  const chain = useProtokitChainStore();
  const network = useNetworkStore();
  const matchQueue = useRandzuLobbiesStore();
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

    matchQueue.loadLobbies(
      client.query.runtime.RandzuLogic,
    );
    matchQueue.loadCurrentLobby(
      client.query.runtime.RandzuLogic,
      PublicKey.fromBase58(network.address!)
    );
  }, [chain.block?.height, network.walletConnected, network.address]);
};
