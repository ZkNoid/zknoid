import { create } from 'zustand';
import { Client, useClientStore } from './client';
import { immer } from 'zustand/middleware/immer';
import { PendingTransaction, UnsignedTransaction } from '@proto-kit/sequencer';
import { PublicKey, UInt64 } from 'o1js';
import { useEffect } from 'react';
import { useProtokitChainStore } from './protokitChain';
import { useNetworkStore } from './network';
import { LeaderboardIndex } from 'zknoid-chain-dev';

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
  loadLeaderboard: (client: Client, competitionId: string) => Promise<void>;
}

function isPendingTransaction(
  transaction: PendingTransaction | UnsignedTransaction | undefined,
): asserts transaction is PendingTransaction {
  if (!(transaction instanceof PendingTransaction))
    throw new Error('Transaction is not a PendingTransaction');
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
    async loadLeaderboard(client: Client, competitionId: string) {
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
            }),
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
  })),
);

export const useObserveArkanoidLeaderboard = (competitionId: string) => {
  const client = useClientStore();
  const chain = useProtokitChainStore();
  const network = useNetworkStore();
  const leaderboard = useArkanoidLeaderboardStore();

  useEffect(() => {
    if (!client.client || !network.address) return;

    leaderboard.loadLeaderboard(client.client, competitionId);
  }, [client.client, chain.block?.height, network.address]);
};
