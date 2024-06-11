import { ALL_GAME_TAGS, ZkNoidGameGenre } from '@/lib/platform/game_tags';
import { GameCard } from '../entities/GameCard';
import { IGame } from '@/app/constants/games';
import { useState } from 'react';
import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { GAME_STORE_SORT_METHODS, GameStoreSortBy } from '../lib/sortBy';
import Pagination from '@/components/shared/Pagination';
import { SortByFilter } from '@/components/widgets/GameStore/Storefront/ui/SortByFilter';
import { api } from '@/trpc/react';
import { useNetworkStore } from '@/lib/stores/network';
import Lottie from 'react-lottie';
import SnakeNoEvents from './assets/ZKNoid_Snake_Intro_03_05.json';
import { sortByFilter } from '../lib/sortBy';

export default function FavoriteGames({ games }: { games: IGame[] }) {
  const PAGINATION_LIMIT = 8;

  const [genresSelected, setGenresSelected] = useState<ZkNoidGameGenre[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<GameStoreSortBy>(
    GameStoreSortBy.RatingLow
  );
  const networkStore = useNetworkStore();
  const getFavoritesQuery = api.favorites.getFavoriteGames.useQuery({
    userAddress: networkStore.address ?? '',
  });

  const filteredGames = games.filter(
    (x) =>
      (genresSelected.includes(x.genre) || genresSelected.length == 0) &&
      getFavoritesQuery.data &&
      getFavoritesQuery.data.favorites.some((y) => y.gameId == x.id && y.status)
  );

  const renderGames = filteredGames.slice(
    (currentPage - 1) * PAGINATION_LIMIT,
    currentPage * PAGINATION_LIMIT
  );

  return (
    <div className="top-0 flex h-full w-full flex-col gap-5 p-4 pb-[100px] lg:p-10">
      <div className={'flex w-full flex-col gap-5 lg:max-w-[40%]'}>
        <div className="pb-3 text-headline-1">Favorite Games</div>
        <div className="font-plexsans text-main">
          If you have any questions or notice any issues with the operation of
          our application, please do not hesitate to contact us. We will be more
          than happy to answer any questions you may have and try our best to
          solve any problems as soon as possible.
        </div>
      </div>

      <div className="flex min-h-[40vh] flex-col justify-between gap-6">
        <div className={'flex w-full flex-row justify-end lg:justify-between'}>
          <div className="hidden flex-row gap-3 lg:flex">
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
          <div className="flex grid-cols-4 flex-col gap-5 max-[1600px]:grid-cols-3 max-[1400px]:grid-cols-2 lg:grid">
            {renderGames
              .sort((a, b) => sortByFilter(a, b, sortBy))
              .map((game) => (
                <GameCard
                  game={game}
                  key={game.id}
                  color={
                    game.genre === ZkNoidGameGenre.BoardGames
                      ? 1
                      : game.genre === ZkNoidGameGenre.Arcade
                        ? 2
                        : 3
                  }
                />
              ))}
            {renderGames.length == 0 && (
              <div className="h-[352px] w-fit">
                <Lottie
                  options={{
                    animationData: SnakeNoEvents,
                    rendererSettings: {
                      className: 'z-0 h-full',
                    },
                  }}
                ></Lottie>
              </div>
            )}
          </div>
        </div>
        <AnimatePresence initial={false} mode={'wait'}>
          {filteredGames.length > PAGINATION_LIMIT ? (
            <motion.div
              className={'flex w-full items-center justify-center py-4'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Pagination
                pagesAmount={Math.ceil(filteredGames.length / PAGINATION_LIMIT)}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </motion.div>
          ) : undefined}
        </AnimatePresence>
      </div>
    </div>
  );
}
