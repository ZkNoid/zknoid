import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { PendingTransaction, UnsignedTransaction } from '@proto-kit/sequencer';
import { PublicKey, UInt64 } from 'o1js';
import { useContext, useEffect } from 'react';
import { useProtokitChainStore } from '../../../lib/stores/protokitChain';
import { useNetworkStore } from '../../../lib/stores/network';
import { LeaderboardIndex } from 'zknoid-chain-dev';
import { ClientAppChain } from '@proto-kit/sdk';
import { arkanoidConfig } from '../config';
import AppChainClientContext from '@/lib/contexts/AppChainClientContext';

interface ILeaderboardInfo {
  score: UInt64;
  player: PublicKey;
}

const LEADERBOARD_SIZE = 20;

export interface LeaderboardState {
  loading: boolean;
  leaderboard: {
    [competitionId: string]: ILeaderboardInfo[];
  };
  getLeaderboard: (competitionId: string) => ILeaderboardInfo[];
  loadLeaderboard: (
    client: ClientAppChain<typeof arkanoidConfig.runtimeModules>,
    competitionId: string
  ) => Promise<void>;
}

export const useArkanoidLeaderboardStore = create<
  LeaderboardState,
  [['zustand/immer', never]]
>(
  immer((set) => ({
    loading: Boolean(false),
    leaderboard: {},
    getLeaderboard(competitionId: string) {
      return this.leaderboard?.[competitionId] ?? [];
    },
    async loadLeaderboard(
      client: ClientAppChain<typeof arkanoidConfig.runtimeModules>,
      competitionId: string
    ) {
      if (isNaN(+competitionId)) {
        console.log("Can't get leaderbord for NaN competitionId");
        return;
      }
      set((state) => {
        state.loading = true;
      });

      const leaderboard = [] as ILeaderboardInfo[];

      for (let i = 0; i < LEADERBOARD_SIZE; i++) {
        const leaderboardItem =
          await client.query.runtime.ArkanoidGameHub.leaderboard.get(
            // @ts-expect-error
            new LeaderboardIndex({
              competitionId: UInt64.from(+competitionId),
              index: UInt64.from(i),
            })
          );
        if (leaderboardItem !== undefined) {
          leaderboard.push({
            score: leaderboardItem!.score,
            player: leaderboardItem!.player,
          });
        }
      }
      set((state) => {
        // @ts-ignore
        state.leaderboard[competitionId] = leaderboard;
        state.loading = false;
      });
    },
  }))
);

export const useObserveArkanoidLeaderboard = (competitionId: string) => {
  const client = useContext<
    ClientAppChain<typeof arkanoidConfig.runtimeModules> | undefined
  >(AppChainClientContext);
  const chain = useProtokitChainStore();
  const network = useNetworkStore();
  const leaderboard = useArkanoidLeaderboardStore();

  useEffect(() => {
    if (!client) {
      throw Error('Client is not set in context');
    }
    if (!network.protokitClientStarted) return;

    leaderboard.loadLeaderboard(client, competitionId);
  }, [chain.block?.height, network.protokitClientStarted]);
};
