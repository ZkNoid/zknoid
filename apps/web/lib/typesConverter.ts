import { Competition } from 'zknoid-chain-dev';

import { ICompetition } from './types';
import { Currency } from '@/constants/currency';
import { arkanoidConfig } from '@/games/arkanoid/config';

// Converts contract competition to ICompetition
export function fromContractCompetition(
  competitionId: number,
  competition: Competition
): ICompetition {
  return {
    id: competitionId,
    seed: competition.seed.toString(),
    game: {
      id: arkanoidConfig.id,
      genre: arkanoidConfig.genre,
      rules: arkanoidConfig.rules,
    }, // only for arkanoid
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
