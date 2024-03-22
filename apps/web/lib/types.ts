import { Currency } from '@/constants/currency';
import { ZkNoidGameGenre } from '@/lib/platform/game_tags';

export interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
}

export interface IBrick {
  x: number;
  y: number;
  w: number;
  h: number;
  value: number;
}

export interface Cart {
  x: number;
  y: number;
  w: number;
  h: number;
  dx: number;
  ddx: number;
  hitMomentum: number;
}

// export interface ICompetition {
//   competitionId: number;
//   name: string;
//   seed: number;
//   prereg: boolean;
//   preregStartTime: number;
//   preregEndTime: number;
//   competitionStartTime: number;
//   competitionEndTime: number;
//   funds: number;
//   participationFee: number;
//   registered?: boolean;
// }

export interface ICompetition {
  id: number;
  seed: number;
  game: { id: string; genre: ZkNoidGameGenre };
  title: string;
  preReg: boolean;
  preRegDate: {
    start: Date;
    end: Date;
  };
  competitionDate: {
    start: Date;
    end: Date;
  };
  participationFee: bigint;
  currency: Currency;
  reward: bigint;
  registered?: boolean;
}

const bricksInRow = 5;
const bricksInCol = 2;
