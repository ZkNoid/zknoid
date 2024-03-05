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
