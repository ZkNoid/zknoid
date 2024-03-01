import { ALL_GAME_TAGS, ZkNoidGameGenre } from '@/lib/platform/game_tags';
import { GameCard } from '@/components/ui/games-store/GameCard';
import { IGame } from '@/app/constants/games';
import { useState } from 'react';
import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { ALL_SORT_METHODS, SortBy } from '@/app/constants/sortBy';

export const FavoriteGames = ({ games }: { games: IGame[] }) => {
  const [genresSelected, setGenresSelected] = useState<ZkNoidGameGenre[]>([]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pagesAmount, _setPagesAmount] = useState<number>(3);

  const [isSortByOpen, setIsSortByOpen] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.RatingLow);

  return (
    <div className="top-0 flex h-full w-full flex-col gap-20 p-10">
      <div className={'flex max-w-[40%] flex-col gap-3'}>
        <div className="text-headline-1">Favorite Games</div>
        <div className="font-plexsans text-main">
          If you have any questions or notice any issues with the operation of
          our application, please do not hesitate to contact us. We will be more
          than happy to answer any questions you may have and try our best to
          solve any problems as soon as possible.
        </div>
      </div>

      <div className="flex min-h-[40vh] flex-col justify-between gap-2">
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
          <div className={'relative flex flex-col gap-4'}>
            <span
              className={clsx(
                'group flex min-w-[300px] cursor-pointer flex-row items-center gap-2 rounded-[5px] border border-bg-dark px-4 py-1 hover:border-left-accent hover:text-left-accent',
                {
                  'rounded-b-none border-white duration-75 ease-out':
                    isSortByOpen,
                }
              )}
              onClick={() => setIsSortByOpen(!isSortByOpen)}
            >
              <span>Sort By: {sortBy}</span>
              <svg
                width="16"
                height="10"
                viewBox="0 0 16 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 1.5L8 8.5L1 1.5"
                  stroke="#252525"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={'stroke-white group-hover:stroke-left-accent'}
                />
              </svg>
            </span>
            <AnimatePresence initial={false} mode={'wait'}>
              {isSortByOpen && (
                <motion.div
                  className={
                    'absolute top-full z-10 flex w-full min-w-[300px] flex-col items-center justify-start overflow-hidden rounded-[5px] rounded-t-none border border-t-0 bg-bg-dark'
                  }
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: 'spring', duration: 0.8, bounce: 0 }}
                >
                  {ALL_SORT_METHODS.map((value, index) => (
                    <span
                      key={index}
                      onClick={() => {
                        setSortBy(value);
                        setIsSortByOpen(false);
                      }}
                      className={
                        'h-full w-full cursor-pointer p-4 hover:text-left-accent'
                      }
                    >
                      {value}
                    </span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div>
          <div className="grid gap-5 max-[1900px]:grid-cols-3 min-[1900px]:grid-cols-4">
            {games
              .filter(
                (x) =>
                  genresSelected.includes(x.genre) || genresSelected.length == 0
              )
              .map((game) => (
                <GameCard game={game} key={game.id} />
              ))}
          </div>
        </div>
        <div className={'flex w-full items-center justify-center py-4'}>
          <div className={'flex flex-row items-center justify-center gap-2'}>
            <span
              className={'cursor-pointer'}
              onClick={() =>
                setCurrentPage((prevState) =>
                  prevState > 1 ? prevState - 1 : prevState
                )
              }
            >
              <svg
                width="10"
                height="16"
                viewBox="0 0 10 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.51116 15L1 8L8.51116 1"
                  stroke="#D2FF00"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>

            <span
              className={
                'flex flex-row items-center justify-center gap-2 pt-0.5'
              }
            >
              {[...Array(pagesAmount).keys()].map((value) => (
                <span
                  key={value + 1}
                  className={`cursor-pointer text-left-accent hover:underline ${
                    value + 1 === currentPage ? 'opacity-100' : 'opacity-40'
                  }`}
                  onClick={() => setCurrentPage(value + 1)}
                >
                  {value + 1}
                </span>
              ))}
            </span>

            <span
              className={'cursor-pointer'}
              onClick={() =>
                setCurrentPage((prevState) =>
                  prevState < pagesAmount ? prevState + 1 : prevState
                )
              }
            >
              <svg
                width="11"
                height="16"
                viewBox="0 0 11 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.5113 15L9.02246 8L1.5113 1"
                  stroke="#D2FF00"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
