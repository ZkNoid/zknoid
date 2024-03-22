import { DEFAULT_GAME_COST } from 'zknoid-chain-dev/dist/src/engine/MatchMaker';

export interface RandzuCompetition {
  id: string;
  name: string;
  enteringPrice: bigint;
  prizeFund: bigint;
}

export const randzuCompetitions: RandzuCompetition[] = [
  {
    id: 'global',
    name: 'Global competition',
    enteringPrice: BigInt(+DEFAULT_GAME_COST.toString()),
    prizeFund: 0n,
  },
  {
    id: 'paid',
    name: 'Paid competition',
    enteringPrice: 5n,
    prizeFund: 10n,
  },
];
