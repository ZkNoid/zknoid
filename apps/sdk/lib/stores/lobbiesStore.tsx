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
import ZkNoidGameContext from '../contexts/ZkNoidGameContext';
import { PendingLobbyIndex } from 'zknoid-chain-dev/dist/src/engine/MatchMaker';

export interface IMatchamkingOption {
  id: number;
  pay: number;
  isPending: boolean;
}

export interface LobbiesState {
  loading: boolean;
  lobbies: ILobby[];
  activeLobby?: ILobby;
  currentLobby?: ILobby;
  selfReady: boolean;
  activeGameId?: number;
  matchmakingOptions: IMatchamkingOption[];
  clearStore(): void;
  loadPendingmatchmakingStatus(
    query: ModuleQuery<LobbyManager>,
    address: PublicKey,
    blochHeight: number
  ): Promise<void>;
  loadLobbies(
    query: ModuleQuery<LobbyManager>,
    address: PublicKey,
    rewardCoeff: number
  ): Promise<void>;
  loadmatchmakingOptions(query: ModuleQuery<MatchMaker>): Promise<void>;
}

export const lobbyInitializer = immer<LobbiesState>((set) => ({
  loading: Boolean(true),
  lobbies: [],
  currentLobby: undefined,
  activeLobby: undefined,
  selfReady: false,
  activeGameId: undefined,
  matchmakingOptions: [],
  clearStore() {
    set((state) => {
      state.lobbies = [];
      state.currentLobby = undefined;
      state.selfReady = false;
      state.activeGameId = undefined;
      state.matchmakingOptions = [];
    });
  },
  async loadPendingmatchmakingStatus(
    query: ModuleQuery<MatchMaker>,
    address: PublicKey,
    blockHeight: number
  ) {
    const PENDING_BLOCKS_NUM = 20;

    const matchmakingOptions: IMatchamkingOption[] = [];

    for (let i = 0; i < this.matchmakingOptions.length; i++) {
      const pendingLobbyIndex = new PendingLobbyIndex({
        roundId: UInt64.from(blockHeight).div(PENDING_BLOCKS_NUM),
        type: UInt64.from(i + 1),
      });

      const pendingLobbyInfo = await query.pendingLobby.get(pendingLobbyIndex);

      matchmakingOptions.push({
        id: this.matchmakingOptions[i].id,
        pay: this.matchmakingOptions[i].pay,
        isPending: pendingLobbyInfo?.players
          .map((val) => val.toBase58())
          .includes(address.toBase58())!!,
      });
    }

    console.log('New matchmaking options', matchmakingOptions);

    set((state) => {
      state.matchmakingOptions = matchmakingOptions;
    });
  },
  async loadLobbies(
    query: ModuleQuery<MatchMaker>,
    address: PublicKey,
    rewardCoeff: number
  ) {
    set((state) => {
      state.loading = true;
    });

    const lastLobbyId = await query.lastLobbyId.get();
    let lobbies: ILobby[] = [];
    let activeLobby: ILobby | undefined = undefined;

    if (!lastLobbyId) {
      console.log(`Can't get lobby info`);
      return;
    }

    const contractActiveGameId = await query.activeGameId.get(address);
    const currentLobbyId = await query.currentLobby.get(address);
    const activeGameId = contractActiveGameId
      ? +contractActiveGameId
      : contractActiveGameId;

    console.log('contractActiveGameId', contractActiveGameId);

    if (contractActiveGameId) {
      const contractActiveLobby =
        await query.activeLobby.get(contractActiveGameId);
      if (contractActiveLobby) {
        const curLobby = contractActiveLobby!;
        console.log('CurrLobby', curLobby);
        const players = +curLobby.curAmount;

        activeLobby = {
          id: Number(curLobby.id.toBigInt()),
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
        };
      }
    }

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

    console.log('Active lobby', activeLobby);

    set((state) => {
      // @ts-ignore
      state.lobbies = lobbies;
      state.loading = false;
      state.currentLobby = curLobby;
      state.activeGameId = activeGameId;
      state.selfReady = selfReady;
      state.activeLobby = activeLobby;
    });
  },

  async loadmatchmakingOptions(query: ModuleQuery<MatchMaker>) {
    console.log('Options loading');
    let lastDefaultLobbyId = await query.lastDefaultLobby.get();
    let matchmakingOptions: IMatchamkingOption[] = [];

    if (lastDefaultLobbyId) {
      for (let i = 1; i < +lastDefaultLobbyId; i++) {
        let curDefaultLobby = await query.defaultLobbies.get(UInt64.from(i));

        matchmakingOptions.push({
          id: i,
          pay: +curDefaultLobby!.participationFee,
          isPending: false,
        });
      }
    }

    set((state) => {
      state.matchmakingOptions = matchmakingOptions;
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
  const { client } = useContext(ZkNoidGameContext);

  useEffect(() => {
    if (!network.protokitClientStarted) {
      return;
    }

    if (!client) {
      throw Error('Context app chain client is not set');
    }

    if (network.address) {
      lobbiesStore.loadLobbies(
        query!,
        PublicKey.fromBase58(network.address),
        rewardCoeff
      );
      console.log('bcl', chain.block?.height);
      if (chain.block?.height) {
        console.log('Loading..');

        lobbiesStore.loadPendingmatchmakingStatus(
          query!,
          PublicKey.fromBase58(network.address),
          chain.block?.height
        );
      }
    }
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

    lobbiesStore.loadmatchmakingOptions(query!);
  }, [network.walletConnected, network.address]);
};
