import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { PublicKey, UInt64 } from 'o1js';
import { MutableRefObject, useContext, useEffect } from 'react';
import { useProtokitChainStore } from '../../../lib/stores/protokitChain';
import { useNetworkStore } from '../../../lib/stores/network';
import { LeaderboardIndex } from 'zknoid-chain-dev';
import { type ClientAppChain } from '@proto-kit/sdk';
import { arkanoidConfig } from '../config';
import ZkNoidGameContext from '@/lib/contexts/ZkNoidGameContext';

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
    client: ClientAppChain<typeof arkanoidConfig.runtimeModules, any, any, any>,
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
      client: ClientAppChain<
        typeof arkanoidConfig.runtimeModules,
        any,
        any,
        any
      >,
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
            //@ts-ignore
            new LeaderboardIndex({
              competitionId: UInt64.from(+competitionId),
              index: UInt64.from(i),
            })
          );
        if (
          leaderboardItem !== undefined &&
          leaderboardItem!.player.equals(PublicKey.empty()).not().toBoolean()
        ) {
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

export const useObserveArkanoidLeaderboard = (
  competitionId: string,
  shouldUpdate: MutableRefObject<boolean>
) => {
  const { client } = useContext(ZkNoidGameContext);
  const chain = useProtokitChainStore();
  const network = useNetworkStore();
  const leaderboard = useArkanoidLeaderboardStore();

  useEffect(() => {
    console.log('Block id', chain.block?.height);
    if (!client) {
      throw Error('Client is not set in context');
    }
    if (!network.protokitClientStarted) return;

    if (!shouldUpdate.current) return;

    leaderboard.loadLeaderboard(client, competitionId);
  }, [chain.block?.height, network.protokitClientStarted]);
};
