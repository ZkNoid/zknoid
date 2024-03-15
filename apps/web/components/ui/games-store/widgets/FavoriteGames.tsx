import { ALL_GAME_TAGS, ZkNoidGameGenre } from '@/lib/platform/game_tags';
import { GameCard } from '@/components/ui/games-store/GameCard';
import { IGame } from '@/app/constants/games';
import { useState } from 'react';
import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { GAME_STORE_SORT_METHODS, GameStoreSortBy } from '@/constants/sortBy';
import { Pagination } from '@/components/ui/games-store/shared/Pagination';
import { SortByFilter } from '@/components/ui/games-store/SortByFilter';

export const FavoriteGames = ({ games }: { games: IGame[] }) => {
  const [genresSelected, setGenresSelected] = useState<ZkNoidGameGenre[]>([]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pagesAmount, _setPagesAmount] = useState<number>(3);

  const [sortBy, setSortBy] = useState<GameStoreSortBy>(
    GameStoreSortBy.RatingLow
  );

  const sortByFliter = (a: IGame, b: IGame) => {
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

  return (
    <div className="top-0 flex h-full w-full flex-col gap-5 p-10 pb-[100px]">
      <div className={'flex max-w-[40%] flex-col gap-5'}>
        <div className="pb-3 text-headline-1">Favorite Games</div>
        <div className="font-plexsans text-main">
          If you have any questions or notice any issues with the operation of
          our application, please do not hesitate to contact us. We will be more
          than happy to answer any questions you may have and try our best to
          solve any problems as soon as possible.
        </div>
      </div>

      <div className="flex min-h-[40vh] flex-col justify-between gap-6">
        <div className={'flex w-full flex-row justify-between'}>
          <div className="flex flex-row gap-3">
            {ALL_GAME_TAGS.map((x) => (
              <div
                key={x.name}
                className={clsx(
                  'cursor-pointer rounded border p-1 font-plexsans text-filtration-buttons',
                  genresSelected == x.genres
                    ? 'border-left-accent bg-left-accent text-bg-dark'
                    : 'hover:border-left-accent hover:text-left-accent'
                )}
                onClick={() => {
                  genresSelected == x.genres
                    ? setGenresSelected([])
                    : setGenresSelected(x.genres);
                }}
              >
                {x.name}
              </div>
            ))}
          </div>
          <SortByFilter
            sortMethods={GAME_STORE_SORT_METHODS}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>
        <div>
          <div className="grid grid-cols-4 gap-5 max-[1600px]:grid-cols-3 max-[1400px]:grid-cols-2">
            {games
              .filter(
                (x) =>
                  genresSelected.includes(x.genre) || genresSelected.length == 0
              )
              .sort((a, b) => sortByFliter(a, b))
              .map((game) => (
                <GameCard
                  game={game}
                  key={game.id}
                  fullImageW={game.id === 'arkanoid'}
                  fullImageH={game.id === 'arkanoid'}
                  color={
                    game.isReleased
                      ? game.genre === ZkNoidGameGenre.BoardGames
                        ? 1
                        : game.genre === ZkNoidGameGenre.Arcade
                          ? 2
                          : 3
                      : 4
                  }
                />
              ))}
          </div>
        </div>
        <AnimatePresence initial={false} mode={'wait'}>
          {genresSelected.length != 0 ? (
            <motion.div
              className={'flex w-full items-center justify-center py-4'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Pagination
                pagesAmount={pagesAmount}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </motion.div>
          ) : undefined}
        </AnimatePresence>
      </div>
    </div>
  );
};
