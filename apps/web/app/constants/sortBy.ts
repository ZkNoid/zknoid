export enum SortBy {
  RatingLow = 'Rating from High to Low',
  RatingHigh = 'Rating from Low to High',
  PopularHigh = 'Most Popular',
  PopularLow = 'Less Popular',
  NewRelease = 'New Release',
  ComingSoon = 'Coming Soon',
}

export const ALL_SORT_METHODS = [
  SortBy.RatingLow,
  SortBy.RatingHigh,
  SortBy.PopularHigh,
  SortBy.PopularLow,
  SortBy.NewRelease,
  SortBy.ComingSoon,
];
