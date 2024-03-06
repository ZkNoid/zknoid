import { PublicKey, UInt64 } from 'o1js';
import { useContext, useEffect } from 'react';
import { useProtokitChainStore } from '@/lib/stores/protokitChain';
import { useNetworkStore } from '@/lib/stores/network';
import { RandzuField } from 'zknoid-chain-dev';
import AppChainClientContext from '@/lib/contexts/AppChainClientContext';
import { randzuConfig } from '../config';
import { ClientAppChain } from '@proto-kit/sdk';
import { MatchMaker } from 'zknoid-chain-dev/dist/src/engine/MatchMaker';
import { ModuleQuery } from '@proto-kit/sequencer';
import { IGameInfo, useMatchQueueStore } from '@/lib/stores/matchQueue';

export interface MatchQueueState {
  loading: boolean;
  queueLength: number;
  inQueue: boolean;
  activeGameId: bigint;
  gameInfo: IGameInfo<RandzuField> | undefined;
  lastGameState: 'win' | 'lost' | undefined;
  getQueueLength: () => number;
  loadMatchQueue(
    query: ModuleQuery<MatchMaker>,
    blockHeight: number
  ): Promise<void>;
  loadActiveGame: (
    query: ModuleQuery<MatchMaker>,
    blockHeight: number,
    address: PublicKey
  ) => Promise<void>;
  resetLastGameState: () => void;
}

export const useObserveRandzuMatchQueue = () => {
  const chain = useProtokitChainStore();
  const network = useNetworkStore();
  const matchQueue = useMatchQueueStore();
  const client = useContext<
    ClientAppChain<typeof randzuConfig.runtimeModules> | undefined
  >(AppChainClientContext);

  useEffect(() => {
    if (!network.walletConnected) {
      return;
    }

    if (!client) {
      throw Error('Context app chain client is not set');
    }

    matchQueue.loadMatchQueue(client.query.runtime.RandzuLogic, parseInt(chain.block?.height ?? '0'));
    matchQueue.loadActiveGame(
      client.query.runtime.RandzuLogic,
      parseInt(chain.block?.height ?? '0'),
      PublicKey.fromBase58(network.address!)
    );
  }, [chain.block?.height, network.walletConnected, network.address]);
};

