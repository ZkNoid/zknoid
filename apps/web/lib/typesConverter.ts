import { Competition } from 'zknoid-chain-dev';
import { ICompetition } from './types';

// Converts contract competition to ICompetition
export function fromContractCompetition(
  competitionId: number,
  competition: Competition,
): ICompetition {
  return {
    competitionId,
    name: competition.name.toString(),
    seed: +competition.seed.toString(),
    prereg: competition.prereg.toBoolean(),
    preregBefore: +competition.preregBefore.toString(),
    preregAfter: +competition.preregAfter.toString(),
    competitionStartTime: +competition.competitionStartTime.toString(),

    competitionEndTime: +competition.competitionEndTime.toString(),

    funds: +competition.funds.toString(),
    participationFee: +competition.participationFee.toString(),
  };
}
