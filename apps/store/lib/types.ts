import { Currency } from '@/constants/currency';
import { ZkNoidGameGenre } from '@/lib/platform/game_tags';
import { PublicKey } from 'o1js';

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

export interface ICompetition {
  id: number;
  creator?: PublicKey;
  seed: number;
  game: { id: string; genre: ZkNoidGameGenre; rules: string };
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

export interface ICompetitionPVP {
  id: number;
  game: {
    id: string;
    name: string;
    rules: string;
    rating: number;
    author: string;
  };
  title: string;
  reward: bigint;
  currency: Currency;
  startPrice: bigint;
}

export interface ILobby {
  id: number;
  active: boolean;
  name: string;
  reward: bigint;
  fee: bigint;
  maxPlayers: number;
  players: number;
  playersAddresses?: PublicKey[];
  playersReady?: boolean[];
  privateLobby: boolean;
  currency: Currency;
  accessKey: number; // TEMPORARY!!!
}

const bricksInRow = 5;
const bricksInCol = 2;
