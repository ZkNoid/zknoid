import { ICompetition } from '@/lib/types';

export enum CompetitionsSortBy {
  LowFunds = 'From High to Low Funds',
  HighFunds = 'From Low to High Funds',
  LowFees = 'From High to Low Fees',
  HighFees = 'From Low to High Fees',
  Latest = 'From Nearest to Latest',
  Nearest = 'From Latest to Nearest',
}

export const COMPETITIONS_SORT_METHODS = [
  CompetitionsSortBy.LowFunds,
  CompetitionsSortBy.HighFunds,
  CompetitionsSortBy.LowFees,
  CompetitionsSortBy.HighFees,
  CompetitionsSortBy.Latest,
  CompetitionsSortBy.Nearest,
];

export const sortByFilter = (
  a: ICompetition,
  b: ICompetition,
  sortBy: CompetitionsSortBy
): number => {
  switch (sortBy) {
    case CompetitionsSortBy.HighFees:
      return Number(a.participationFee - b.participationFee);

    case CompetitionsSortBy.LowFees:
      return Number(b.participationFee - a.participationFee);

    case CompetitionsSortBy.HighFunds:
      return Number(a.reward - b.reward);

    case CompetitionsSortBy.LowFunds:
      return Number(b.reward - a.reward);

    case CompetitionsSortBy.Latest:
      return (
        a.competitionDate.start.getDate() - b.competitionDate.start.getDate()
      );

    case CompetitionsSortBy.Nearest:
      return (
        b.competitionDate.start.getDate() - a.competitionDate.start.getDate()
      );
  }
};
