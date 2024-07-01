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
    claimed: boolean;
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
