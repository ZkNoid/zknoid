import { immer } from 'zustand/middleware/immer';
import { Bool, PublicKey, UInt64 } from 'o1js';
import { type ModuleQuery } from '@proto-kit/sequencer';
import { LobbyManager } from 'zknoid-chain-dev/dist/src/engine/LobbyManager';
import { ILobby } from '../types';
import { Currency } from '@/constants/currency';
import { ClientAppChain, MatchMaker } from 'zknoid-chain-dev';
import { create } from 'zustand';
import { useProtokitChainStore } from './protokitChain';
import { useNetworkStore } from './network';
import { useContext, useEffect } from 'react';
import AppChainClientContext from '../contexts/AppChainClientContext';

export interface IMatchamkingOption {
  id: number;
  pay: number;
}

export interface LobbiesState {
  loading: boolean;
  lobbies: ILobby[];
  currentLobby?: ILobby;
  selfReady: boolean;
  activeGameId?: number;
  mathcmakingOptions: IMatchamkingOption[];
  clearStore(): void;
  loadLobbies(
    query: ModuleQuery<LobbyManager>,
    address: PublicKey,
    rewardCoeff: number
  ): Promise<void>;
  loadMathcmakingOptions(query: ModuleQuery<MatchMaker>): Promise<void>;
}

export const lobbyInitializer = immer<LobbiesState>((set) => ({
  loading: Boolean(true),
  lobbies: [],
  currentLobby: undefined,
  selfReady: false,
  activeGameId: undefined,
  mathcmakingOptions: [],
  clearStore() {
    set((state) => {
      state.lobbies = [];
      state.currentLobby = undefined;
      state.selfReady = false;
      state.activeGameId = undefined;
      state.mathcmakingOptions = [];
    });
  },
  async loadLobbies(
    query: ModuleQuery<LobbyManager>,
    address: PublicKey,
    rewardCoeff: number
  ) {
    set((state) => {
      state.loading = true;
    });

    const lastLobbyId = await query.lastLobbyId.get();
    let lobbies: ILobby[] = [];

    if (!lastLobbyId) {
      console.log(`Can't get lobby info`);
      return;
    }

    const contractActiveGameId = await query.activeGameId.get(address);
    const currentLobbyId = await query.currentLobby.get(address);
    const activeGameId = contractActiveGameId
      ? +contractActiveGameId
      : contractActiveGameId;

    for (let i = 0; i < +lastLobbyId; i++) {
      let curLobby = await query.activeLobby.get(UInt64.from(i));

      if (
        curLobby &&
        (curLobby.started.not().toBoolean() ||
          (activeGameId &&
            curLobby.id.equals(UInt64.from(activeGameId)).toBoolean())) &&
        curLobby.active.toBoolean()
      ) {
        const players = +curLobby.curAmount;
        lobbies.push({
          id: i,
          active: curLobby.active.toBoolean(),
          name: curLobby.name.toString(),
          reward:
            (BigInt(rewardCoeff * 1000) *
              curLobby.participationFee.toBigInt()) /
            1000n,
          fee: curLobby.participationFee.toBigInt(),
          maxPlayers: 2,
          players,
          playersAddresses: curLobby.players.slice(0, players),
          playersReady: curLobby.ready
            .slice(0, players)
            .map((val: Bool) => val.toBoolean()),
          privateLobby: curLobby.privateLobby.toBoolean(),
          currency: Currency.ZNAKES,
          accessKey: +curLobby.accessKey,
        });
      }
    }

    let curLobby: ILobby | undefined = undefined;
    let selfReady: boolean = false;

    if (currentLobbyId || activeGameId) {
      const lobbyId = currentLobbyId
        ? +currentLobbyId
          ? +currentLobbyId
          : activeGameId
        : activeGameId;
      curLobby = lobbies.find((lobby) => lobby.id == lobbyId);

      if (curLobby) {
        for (let i = 0; i < curLobby.players; i++) {
          if (curLobby.playersAddresses![i].equals(address).toBoolean()) {
            selfReady = curLobby!.playersReady![i];
          }
        }
      }
    }

    set((state) => {
      // @ts-ignore
      state.lobbies = lobbies;
      state.loading = false;
      state.currentLobby = curLobby;
      state.activeGameId = activeGameId;
      state.selfReady = selfReady;
    });
  },

  async loadMathcmakingOptions(query: ModuleQuery<MatchMaker>) {
    let lastDefaultLobbyId = await query.lastDefaultLobby.get();
    let mathcmakingOptions: IMatchamkingOption[] = [];

    if (lastDefaultLobbyId) {
      for (let i = 1; i < +lastDefaultLobbyId; i++) {
        let curDefaultLobby = await query.defaultLobbies.get(UInt64.from(i));

        mathcmakingOptions.push({
          id: i,
          pay: +curDefaultLobby!.participationFee,
        });
      }
    }

    set((state) => {
      state.mathcmakingOptions = mathcmakingOptions;
    });
  },
}));

export const useLobbiesStore = create<LobbiesState, [['zustand/immer', never]]>(
  lobbyInitializer
);

export const useObserveLobbiesStore = (
  query: ModuleQuery<MatchMaker> | undefined,
  rewardCoeff: number = 2
) => {
  const chain = useProtokitChainStore();
  const network = useNetworkStore();
  const lobbiesStore = useLobbiesStore();
  const client = useContext<ClientAppChain<any, any, any, any> | undefined>(
    AppChainClientContext
  );

  useEffect(() => {
    if (!network.protokitClientStarted) {
      return;
    }

    if (!client) {
      throw Error('Context app chain client is not set');
    }

    lobbiesStore.loadLobbies(
      query!,
      network.address ? PublicKey.fromBase58(network.address) : PublicKey.empty(),
      rewardCoeff
    );
  }, [chain.block?.height, network.walletConnected, network.address]);

  // Update once wallet connected
  useEffect(() => {
    if (!network.protokitClientStarted) {
      return;
    }

    if (!client) {
      throw Error('Context app chain client is not set');
    }

    lobbiesStore.clearStore();

    lobbiesStore.loadMathcmakingOptions(query!);
  }, [network.walletConnected, network.address]);
};
