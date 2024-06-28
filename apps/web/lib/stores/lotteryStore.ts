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
  tickets?: {
    numbers: [number, number, number, number, number, number];
    funds?: number | undefined;
  }[];
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
  toOngoingRound: () => void;
}

export const useLotteryStore = create<LotteryStore, [['zustand/immer', never]]>(
  immer((set, get) => ({
    currentRoundId: 1,
    ongoingRoundId: 5,
    rounds: [
      {
        id: 1,
        combination: [1, 1, 1, 1, 1, 1],
        bank: 0,
        ticketsAmount: 0,
        date: {
          start: new Date(2024, 0, 1),
          end: new Date(2024, 0, 30),
        },
        tickets: [
          { numbers: [1, 1, 1, 1, 1, 1], funds: 5 },
          { numbers: [1, 1, 1, 1, 1, 1] },
        ],
      },
      {
        id: 2,
        combination: [2, 2, 2, 2, 2, 2],
        bank: 0,
        ticketsAmount: 0,
        date: {
          start: new Date(2024, 1, 1),
          end: new Date(2024, 1, 30),
        },
        tickets: [
          { numbers: [1, 1, 1, 1, 1, 1], funds: 5 },
          { numbers: [1, 1, 1, 1, 1, 1] },
        ],
      },
      {
        id: 3,
        combination: [3, 3, 3, 3, 3, 3],
        bank: 0,
        ticketsAmount: 0,
        date: {
          start: new Date(2024, 2, 1),
          end: new Date(2024, 2, 30),
        },
        tickets: [
          { numbers: [1, 1, 1, 1, 1, 1], funds: 5 },
          { numbers: [1, 1, 1, 1, 1, 1] },
        ],
      },
      {
        id: 4,
        combination: [4, 4, 4, 4, 4, 4],
        bank: 0,
        ticketsAmount: 0,
        date: {
          start: new Date(2024, 3, 1),
          end: new Date(2024, 3, 30),
        },
        tickets: [
          { numbers: [1, 1, 1, 1, 1, 1], funds: 5 },
          { numbers: [1, 1, 1, 1, 1, 1] },
        ],
      },
      {
        id: 5,
        combination: [5, 5, 5, 5, 5, 5],
        bank: 0,
        ticketsAmount: 0,
        date: {
          start: new Date(2024, 4, 1),
          end: new Date(2024, 4, 30),
        },
        tickets: [
          { numbers: [1, 1, 1, 1, 1, 1], funds: 5 },
          { numbers: [1, 1, 1, 1, 1, 1] },
        ],
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
    toOngoingRound() {
      if (get().currentRoundId != get().ongoingRoundId) {
        set((state) => ({
          currentRoundId: state.ongoingRoundId,
        }));
      }
    },
  }))
);
