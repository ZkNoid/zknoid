import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface RateGameStore {
  ratedGames: {
    gameId: string;
    updatedAt: string;
  }[];
  addRatedGame: (gameId: string) => void;
  clear: () => void;
}

export const useRateGameStore = create<
  RateGameStore,
  [['zustand/persist', never]]
>(
  persist(
    (set) => ({
      ratedGames: [],
      addRatedGame: (gameId) => {
        set((state) => ({
          ratedGames: [
            ...state.ratedGames,
            { gameId: gameId, updatedAt: new Date().toISOString() },
          ],
        }));
      },
      clear: () => {
        set({
          ratedGames: [],
        });
      },
    }),
    {
      name: 'rateGameStorage',
    }
  )
);
