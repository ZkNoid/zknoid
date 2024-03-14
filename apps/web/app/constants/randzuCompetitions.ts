import { DEFAULT_GAME_COST } from 'zknoid-chain-dev/dist/src/engine/MatchMaker';

export interface RandzuCompetition {
  id: string;
  name: string;
  enteringPrice: number;
  prizeFund: number;
}

export const randzuCompetitions: RandzuCompetition[] = [
  {
    id: 'global',
    name: 'Global competition',
    enteringPrice: +DEFAULT_GAME_COST.toString(),
    prizeFund: 0,
  },
  {
    id: 'paid',
    name: 'Paid competition',
    enteringPrice: 5,
    prizeFund: 10,
  },
];
