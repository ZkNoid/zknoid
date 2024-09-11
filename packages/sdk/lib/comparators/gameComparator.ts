import { IGame } from "../../constants/games";

export enum GameComparisonType {
  RatingLow = "Rating from High to Low",
  RatingHigh = "Rating from Low to High",
  PopularHigh = "Most Popular",
  PopularLow = "Less Popular",
  NewRelease = "New Release",
  ComingSoon = "Coming Soon",
}

export const GAME_STORE_SORT_METHODS = [
  GameComparisonType.RatingLow,
  GameComparisonType.RatingHigh,
  GameComparisonType.PopularHigh,
  GameComparisonType.PopularLow,
  GameComparisonType.NewRelease,
  GameComparisonType.ComingSoon,
];

export const compare = (a: IGame, b: IGame, sortBy: GameComparisonType) => {
  switch (sortBy) {
    case GameComparisonType.RatingHigh:
      return a.rating - b.rating;

    case GameComparisonType.RatingLow:
      return b.rating - a.rating;

    case GameComparisonType.PopularHigh:
      return b.popularity - a.popularity;

    case GameComparisonType.PopularLow:
      return a.popularity - b.popularity;

    case GameComparisonType.NewRelease:
      return a.releaseDate.getDate() - b.releaseDate.getDate();

    case GameComparisonType.ComingSoon:
      return a.isReleased === b.isReleased ? 0 : a.isReleased ? 1 : -1;

    default:
      return 1;
  }
};
