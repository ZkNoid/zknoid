import { Competition } from 'zknoid-chain-dev';

import { ICompetition } from './types';
import { Currency } from '@/constants/currency';
import { ZkNoidGameGenre } from '@/lib/platform/game_tags';

// Converts contract competition to ICompetition
export function fromContractCompetition(
  competitionId: number,
  competition: Competition
): ICompetition {
  return {
    id: competitionId,
    seed: competition.seed.toString(),
    game: { id: 'arkanoid', genre: ZkNoidGameGenre.Arcade }, // only for arkanoid
    title: competition.name.toString(),
    preReg: competition.prereg.toBoolean(),
    preRegDate: {
      start: new Date(+competition.preregStartTime.toString()),
      end: new Date(+competition.preregEndTime.toString()),
    },
    competitionDate: {
      start: new Date(+competition.competitionStartTime.toString()),
      end: new Date(+competition.competitionEndTime.toString()),
    },
    participationFee: competition.participationFee.toBigInt(),
    currency: Currency.MINA,
    reward: competition.funds.toBigInt(),
  };
}
