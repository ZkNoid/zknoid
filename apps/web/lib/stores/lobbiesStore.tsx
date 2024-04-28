import { immer } from 'zustand/middleware/immer';
import { Bool, PublicKey, UInt64 } from 'o1js';
import { type ModuleQuery } from '@proto-kit/sequencer';
import { LobbyManager } from 'zknoid-chain-dev/dist/src/engine/LobbyManager';
import { ILobby } from '../types';
import { Currency } from '@/constants/currency';

export interface LobbiesState {
  loading: boolean;
  lobbies: ILobby[];
  currentLobby?: ILobby;
  selfReady: boolean;
  activeGameId?: number;
  loadLobbies(
    query: ModuleQuery<LobbyManager>,
    address: PublicKey
  ): Promise<void>;
  loadCurrentLobby(
    query: ModuleQuery<LobbyManager>,
    address: PublicKey
  ): Promise<void>;
}

export const lobbyInitializer = immer<LobbiesState>((set) => ({
  loading: Boolean(false),
  lobbies: [],
  currentLobby: undefined,
  selfReady: false,
  activeGameId: undefined,
  async loadLobbies(query: ModuleQuery<LobbyManager>, address: PublicKey) {
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
    const activeGameId = contractActiveGameId
      ? +contractActiveGameId
      : contractActiveGameId;

    console.log('Last lobby id: ', +lastLobbyId);
    for (let i = 0; i < +lastLobbyId; i++) {
      let curLobby = await query.activeLobby.get(UInt64.from(i));

      if (curLobby && curLobby.started.not().toBoolean()) {
        const players = +curLobby.curAmount;
        lobbies.push({
          id: i,
          name: curLobby.name.toString(),
          reward: 0n,
          fee: curLobby.participationFee.toBigInt(),
          maxPlayers: 2,
          players,
          playersAddresses: curLobby.players.slice(0, players),
          playersReady: curLobby.ready
            .slice(0, players)
            .map((val: Bool) => val.toBoolean()),
          currency: Currency.ZNAKES,
          accessKey: '',
        });
      }
    }

    set((state) => {
      // @ts-ignore
      state.lobbies = lobbies;
      state.loading = false;
      state.activeGameId = activeGameId;
    });
  },

  async loadCurrentLobby(query: ModuleQuery<LobbyManager>, address: PublicKey) {
    set((state) => {
      state.currentLobby = undefined;
    });

    const currentLobbyId = await query.currentLobby.get(address);

    if (currentLobbyId) {
      const curLobby = this.lobbies.find(
        (lobby) => lobby.id == +currentLobbyId
      );

      if (curLobby) {
        for (let i = 0; i < curLobby.players; i++) {
          if (curLobby.playersAddresses![i].equals(address).toBoolean()) {
            set((state) => {
              console.log(`Player selfStatus: ${curLobby.playersReady![i]}`);
              state.selfReady = curLobby.playersReady![i];
            });
          }
        }
      }

      set((state) => {
        state.currentLobby = curLobby;
      });
    }
  },
}));
