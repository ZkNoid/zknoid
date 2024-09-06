import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface RoundsStore {
  roundToShowId: number;
  setRoundToShowId: (roundId: number) => void;
}

export const useRoundsStore = create<RoundsStore, [['zustand/immer', never]]>(
  immer((set, get) => ({
    roundToShowId: 0,
    setRoundToShowId: (roundId: number) =>
      set({
        roundToShowId: roundId,
      }),
  }))
);
