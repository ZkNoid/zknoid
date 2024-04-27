import { immer } from 'zustand/middleware/immer';
import { PublicKey, UInt64 } from 'o1js';
import { type ModuleQuery } from '@proto-kit/sequencer';
import { LobbyManager } from 'zknoid-chain-dev/dist/src/engine/LobbyManager';
import { ILobby } from '../types';
import { Currency } from '@/constants/currency';

export interface LobbiesState {
  loading: boolean;
  lobbies: ILobby[];
  currentLobby?: ILobby;
  loadLobbies(
    query: ModuleQuery<LobbyManager>
  ): Promise<void>;
  loadCurrentLobby(query: ModuleQuery<LobbyManager>, address: PublicKey): Promise<void>
}


export const lobbyInitializer = 
  immer<LobbiesState>((set) => ({
    loading: Boolean(false),
    lobbies: [],
    currentLobby: undefined,
    async loadLobbies(query: ModuleQuery<LobbyManager>) {
      set((state) => {
        state.loading = true;
      });

      const lastLobbyId = await query.lastLobbyId.get();
      let lobbies: ILobby[] = [];

      if (!lastLobbyId) {
        console.log(`Can't get lobby info`);
        return;
      }

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
            currency: Currency.ZNAKES,
            accessKey: ""
          })
        }
      }
      

      set((state) => {
        // @ts-ignore
        state.lobbies = lobbies;
        state.loading = false;
      });
    },

    async loadCurrentLobby(query: ModuleQuery<LobbyManager>, address: PublicKey) {
      set((state) => {
        state.currentLobby = undefined;
      })

      const currentLobbyId = await query.currentLobby.get(address);

      if (currentLobbyId) {
        const curLobby = this.lobbies.find((lobby) => lobby.id == +currentLobbyId);

        set((state) => {
          state.currentLobby = curLobby;
        })
      }
    }
  }));