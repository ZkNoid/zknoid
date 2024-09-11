import { ICompetition } from "../../lib/types";

export enum CompetitionComparisonType {
  LowFunds = "From High to Low Funds",
  HighFunds = "From Low to High Funds",
  LowFees = "From High to Low Fees",
  HighFees = "From Low to High Fees",
  Latest = "From Nearest to Latest",
  Nearest = "From Latest to Nearest",
}

export const COMPETITIONS_SORT_METHODS = [
  CompetitionComparisonType.LowFunds,
  CompetitionComparisonType.HighFunds,
  CompetitionComparisonType.LowFees,
  CompetitionComparisonType.HighFees,
  CompetitionComparisonType.Latest,
  CompetitionComparisonType.Nearest,
];

export const compare = (
  a: ICompetition,
  b: ICompetition,
  sortBy: CompetitionComparisonType
): number => {
  switch (sortBy) {
    case CompetitionComparisonType.HighFees:
      return Number(a.participationFee - b.participationFee);

    case CompetitionComparisonType.LowFees:
      return Number(b.participationFee - a.participationFee);

    case CompetitionComparisonType.HighFunds:
      return Number(a.reward - b.reward);

    case CompetitionComparisonType.LowFunds:
      return Number(b.reward - a.reward);

    case CompetitionComparisonType.Latest:
      return (
        a.competitionDate.start.getDate() - b.competitionDate.start.getDate()
      );

    case CompetitionComparisonType.Nearest:
      return (
        b.competitionDate.start.getDate() - a.competitionDate.start.getDate()
      );
  }
};
