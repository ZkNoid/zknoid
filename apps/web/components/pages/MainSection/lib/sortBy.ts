import { IGame } from '@/app/constants/games';

export enum GameStoreSortBy {
  RatingLow = 'Rating from High to Low',
  RatingHigh = 'Rating from Low to High',
  PopularHigh = 'Most Popular',
  PopularLow = 'Less Popular',
  NewRelease = 'New Release',
  ComingSoon = 'Coming Soon',
}

export const GAME_STORE_SORT_METHODS = [
  GameStoreSortBy.RatingLow,
  GameStoreSortBy.RatingHigh,
  GameStoreSortBy.PopularHigh,
  GameStoreSortBy.PopularLow,
  GameStoreSortBy.NewRelease,
  GameStoreSortBy.ComingSoon,
];

export const sortByFilter = (a: IGame, b: IGame, sortBy: GameStoreSortBy) => {
  switch (sortBy) {
    case GameStoreSortBy.RatingHigh:
      return a.rating - b.rating;

    case GameStoreSortBy.RatingLow:
      return b.rating - a.rating;

    case GameStoreSortBy.PopularHigh:
      return b.popularity - a.popularity;

    case GameStoreSortBy.PopularLow:
      return a.popularity - b.popularity;

    case GameStoreSortBy.NewRelease:
      return a.releaseDate.getDate() - b.releaseDate.getDate();

    case GameStoreSortBy.ComingSoon:
      return a.isReleased === b.isReleased ? 0 : a.isReleased ? 1 : -1;

    default:
      return 1;
  }
};
