export enum GameStoreSortBy {
  RatingLow = 'Rating from High to Low',
  RatingHigh = 'Rating from Low to High',
  PopularHigh = 'Most Popular',
  PopularLow = 'Less Popular',
  NewRelease = 'New Release',
  ComingSoon = 'Coming Soon',
}

export enum CompetitionsSortBy {
  LowFunds = 'From High to Low Funds',
  HighFunds = 'From Low to High Funds',
  LowFees = 'From High to Low Fees',
  HighFees = 'From Low to High Fees',
  Latest = 'From Nearest to Latest',
  Nearest = 'From Latest to Nearest',
}

export enum LobbysSortBy {
  LowFunds = 'From High to Low Funds',
  HighFunds = 'From Low to High Funds',
  LowFees = 'From High to Low Fees',
  HighFees = 'From Low to High Fees',
  LessPlayers = 'From Less to More Players',
  MorePlayers = 'From More to Less Players',
}

export const GAME_STORE_SORT_METHODS = [
  GameStoreSortBy.RatingLow,
  GameStoreSortBy.RatingHigh,
  GameStoreSortBy.PopularHigh,
  GameStoreSortBy.PopularLow,
  GameStoreSortBy.NewRelease,
  GameStoreSortBy.ComingSoon,
];

export const COMPETITIONS_SORT_METHODS = [
  CompetitionsSortBy.LowFunds,
  CompetitionsSortBy.HighFunds,
  CompetitionsSortBy.LowFees,
  CompetitionsSortBy.HighFees,
  CompetitionsSortBy.Latest,
  CompetitionsSortBy.Nearest,
];

export const LOBBYS_SORT_METHODS = [
  LobbysSortBy.LowFunds,
  LobbysSortBy.HighFunds,
  LobbysSortBy.LowFees,
  LobbysSortBy.HighFees,
  LobbysSortBy.LessPlayers,
  LobbysSortBy.MorePlayers,
];
