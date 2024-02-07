import { create } from 'zustand';
import { Client, useClientStore } from '../client';
import { immer } from 'zustand/middleware/immer';
import { Bool, PublicKey, UInt64 } from 'o1js';
import { useEffect } from 'react';
import { useProtokitChainStore } from '../protokitChain';
import { useNetworkStore } from '../network';
import { GameRecordKey, LeaderboardIndex } from 'zknoid-chain-dev';
import { ICompetition } from '@/lib/types';
import { fromContractCompetition } from '@/lib/typesConverter';

export interface CompetitionsState {
  loading: boolean;
  competitions: ICompetition[];
  loadCompetitions: (client: Client, player: PublicKey) => Promise<void>;
}

export const useArkanoidCompetitionsStore = create<
  CompetitionsState,
  [['zustand/immer', never]]
>(
  immer((set) => ({
    loading: false,
    competitions: [],
    async loadCompetitions(client: Client, player: PublicKey) {
      set((state) => {
        state.loading = true;
      });
      let competitions: ICompetition[] = [];
      const lastCompetitionId =
        +(await client.query.runtime.ArkanoidGameHub.lastCompetitonId.get())!.toString();
      for (let i = 0; i < lastCompetitionId; i++) {
        let curCompetition =
          await client.query.runtime.ArkanoidGameHub.competitions.get(
            UInt64.from(i),
          );
        let registered =
          await client.query.runtime.ArkanoidGameHub.registrations.get(
            //@ts-ignore
            new GameRecordKey({
              competitionId: UInt64.from(i),
              player,
            }),
          );
        registered ??= Bool(false);

        competitions.push({
          ...fromContractCompetition(i, curCompetition!),
          registered: registered.toBoolean(),
        });
      }
      set((state) => {
        // @ts-ignore
        state.competitions = competitions;
        state.loading = false;
      });
    },
  })),
);

export const useObserveArkanoidCompetitions = () => {
  const client = useClientStore();
  const chain = useProtokitChainStore();
  const network = useNetworkStore();
  const competitions = useArkanoidCompetitionsStore();

  useEffect(() => {
    if (!client.client || !network.address) return;

    competitions.loadCompetitions(
      client.client,
      PublicKey.fromBase58(network.address!),
    );
  }, [client.client, chain.block?.height, network.address]);
};
