import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PvpLobbyStoreState {
  lastLobbyId: number | undefined;
  setLastLobbyId: (lastLobbyId: number) => void;

  ownedLobbyId: number | undefined;
  setOwnedLobbyId: (ownedLobbyId: number) => void;

  ownedLobbyKey: string | undefined;
  setOwnedLobbyKey: (ownedLobbyKey: string | undefined) => void;

  connectedLobbyId: number | undefined;
  setConnectedLobbyId: (connectedLobbyId: number) => void;

  connectedLobbyKey: string | undefined;
  setConnectedLobbyKey: (connectedLobbyKey: string | undefined) => void;
}

export const usePvpLobbyStorage = create<
  PvpLobbyStoreState,
  [['zustand/persist', never]]
>(
  persist(
    (set, get) => ({
      lastLobbyId: undefined,
      setLastLobbyId: (lastLobbyId) => {
        set((state) => ({
          lastLobbyId: lastLobbyId,
        }));
      },
      ownedLobbyId: undefined,
      setOwnedLobbyId: (ownedLobbyId) => {
        set((state) => ({
          ownedLobbyId: ownedLobbyId,
        }));
      },
      ownedLobbyKey: undefined,
      setOwnedLobbyKey: (ownedLobbyKey) => {
        set((state) => ({
          ownedLobbyKey: ownedLobbyKey,
        }));
      },
      connectedLobbyId: undefined,
      setConnectedLobbyId: (connectedLobbyId) => {
        set((state) => ({
          connectedLobbyId: connectedLobbyId,
        }));
      },
      connectedLobbyKey: undefined,
      setConnectedLobbyKey: (connectedLobbyKey) => {
        set((state) => ({
          connectedLobbyKey: connectedLobbyKey,
        }));
      },
    }),
    {
      name: 'pvpLobbyStorage',
    }
  )
);
