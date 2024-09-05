import { ILobby } from '@/lib/types';

export enum LobbiesSortBy {
  LowFunds = 'From High to Low Funds',
  HighFunds = 'From Low to High Funds',
  LowFees = 'From High to Low Fees',
  HighFees = 'From Low to High Fees',
  LessPlayers = 'From Less to More Players',
  MorePlayers = 'From More to Less Players',
}

export const LOBBYS_SORT_METHODS = [
  LobbiesSortBy.LowFunds,
  LobbiesSortBy.HighFunds,
  LobbiesSortBy.LowFees,
  LobbiesSortBy.HighFees,
  LobbiesSortBy.LessPlayers,
  LobbiesSortBy.MorePlayers,
];

export const sortByFilter = (
  a: ILobby,
  b: ILobby,
  sortBy: LobbiesSortBy
): number => {
  switch (sortBy) {
    case LobbiesSortBy.HighFees:
      return Number(a.fee - b.fee);

    case LobbiesSortBy.LowFees:
      return Number(b.fee - a.fee);

    case LobbiesSortBy.HighFunds:
      return Number(a.reward - b.reward);

    case LobbiesSortBy.LowFunds:
      return Number(b.reward - a.reward);

    case LobbiesSortBy.MorePlayers:
      return Number(b.players - a.players);

    case LobbiesSortBy.LessPlayers:
      return Number(a.players - b.players);
  }
};
