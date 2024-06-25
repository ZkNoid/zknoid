import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface IRound {
  id: number;
  combination?: [number, number, number, number, number, number];
  bank: number;
  ticketsAmount: number;
  date: {
    start: Date;
    end: Date;
  };
}

export interface LotteryStore {
  currentRoundId: number;
  ongoingRoundId: number;
  rounds: IRound[];
  addRound: (round: IRound) => void;
  removeRound: (roundId: number) => void;
  getRound: (roundId: number) => IRound | undefined;
  // updateRound: (roundId: number, round: IRound) => void;
  getPreviousRounds: () => IRound[];
  toNextRound: () => void;
  toPrevRound: () => void;
}

export const useLotteryStore = create<LotteryStore, [['zustand/immer', never]]>(
  immer((set, get) => ({
    currentRoundId: 1,
    ongoingRoundId: 1,
    rounds: [
      {
        id: 1,
        bank: 0,
        ticketsAmount: 0,
        date: {
          start: new Date(2024, 0, 1),
          end: new Date(2024, 0, 30),
        },
      },
      {
        id: 2,
        bank: 0,
        ticketsAmount: 0,
        date: {
          start: new Date(2024, 1, 1),
          end: new Date(2024, 1, 30),
        },
      },
    ],
    addRound(round) {
      set((state) => ({
        rounds: [...state.rounds, round],
      }));
    },
    removeRound(roundId) {
      set((state) => ({
        rounds: state.rounds.filter((round) => round.id !== roundId),
      }));
    },
    getRound(roundId) {
      return get().rounds.find((round) => round.id == roundId);
    },
    // updateRound(roundId, round) {
    //   set((state) => ({
    //     rounds: state.rounds.map((item) =>
    //         item.id == roundId ? round : item
    //     )
    //   }))
    // },
    getPreviousRounds() {
      return get().rounds.filter(
        (round) => round.date.end.getTime() < Date.now()
      );
    },
    toNextRound() {
      if (get().currentRoundId + 1 <= get().rounds.length) {
        set((state) => ({
          currentRoundId: state.currentRoundId + 1,
        }));
      }
    },
    toPrevRound() {
      if (get().currentRoundId - 1 >= 1) {
        set((state) => ({
          currentRoundId: state.currentRoundId - 1,
        }));
      }
    },
  }))
);
