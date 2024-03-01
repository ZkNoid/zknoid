import {
  ALL_GAME_EVENT_TYPES,
  GAME_EVENTS,
  getEventType,
  ZkNoidEventType,
} from '@/lib/platform/game_events';
import { FilterCard } from '@/components/ui/games-store/widgets/GameStore/FilterCard';
import { EventCard } from '@/components/ui/games-store/widgets/GameStore/EventCard';
import { GenreCard } from '@/components/ui/games-store/widgets/GameStore/GenreCard';
import arcadeImg from '@/public/image/genres/arcade.svg';
import {
  ALL_GAME_FEATURES,
  ALL_GAME_GENRES,
  ALL_GAME_TAGS,
  ZkNoidGameFeature,
  ZkNoidGameGenre,
} from '@/lib/platform/game_tags';
import boardImg from '@/public/image/genres/board.svg';
import luckyImg from '@/public/image/genres/lucky.svg';
import soonImg from '@/public/image/genres/soon.svg';
import { FiltrationBox } from '@/components/ui/games-store/widgets/GameStore/FiltrationBox';
import { GameCard } from '@/components/ui/games-store/GameCard';
import { useState } from 'react';
import { IGame } from '@/app/constants/games';
import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { ALL_SORT_METHODS, SortBy } from '@/app/constants/sortBy';
import Image from 'next/image';
import { Competitions } from '@/components/ui/games-store/widgets/GameStore/Competitions';

export const GameStore = ({ games }: { games: IGame[] }) => {
  const [eventTypesSelected, setEventTypesSelected] = useState<
    ZkNoidEventType[]
  >([]);
  const [genresSelected, setGenresSelected] = useState<ZkNoidGameGenre[]>([]);
  const [featuresSelected, setFeaturesSelected] = useState<ZkNoidGameFeature[]>(
    []
  );

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pagesAmount, _setPagesAmount] = useState<number>(3);

  const [isSortByOpen, setIsSortByOpen] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.RatingLow);

  return (
    <div className="top-0 flex h-full w-full flex-col gap-5 p-10">
      <div className="flex flex-col gap-3">
        <div className="text-headline-1">Events & competitions</div>
        <div className="flex flex-row gap-3">
          {ALL_GAME_EVENT_TYPES.map((eventType) => (
            <FilterCard
              key={eventType}
              eventType={eventType}
              typesSelected={eventTypesSelected}
              setTypesSelected={setEventTypesSelected}
              selected={eventTypesSelected.includes(eventType)}
            />
          ))}
        </div>
        <div className="grid min-h-[352px] grid-cols-2 gap-5">
          {GAME_EVENTS.filter(
            (x) =>
              eventTypesSelected.includes(getEventType(x)) ||
              eventTypesSelected.length == 0
          ).map((event) => (
            <EventCard
              key={event.name}
              headText={event.name}
              description={event.description}
              event={event}
            />
          ))}
        </div>
        <div className={'grid grid-cols-2 gap-5'}>
          <div
            className={
              'flex flex-row justify-between rounded-[5px] border border-left-accent'
            }
          >
            <div className={'p-4 pt-5 uppercase text-left-accent'}>
              Show me the all existion competitions
            </div>
            <div className={'bg-left-accent p-4'}>
              <Image
                src={'/image/misc/apps.svg'}
                alt={'Apps'}
                width={32}
                height={32}
              />
            </div>
          </div>
          <div
            className={
              'flex flex-row justify-between rounded-[5px] border border-left-accent'
            }
          >
            <div className={'p-4 pt-5 uppercase text-left-accent'}>
              Create your own competition!
            </div>
            <div className={'bg-left-accent p-4'}>
              <Image
                src={'/image/misc/mech.svg'}
                alt={'Apps'}
                width={32}
                height={32}
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="text-headline-1">Popular genres</div>
        <div className="grid grid-cols-4 gap-5">
          <GenreCard
            image={arcadeImg}
            genre={ZkNoidGameGenre.Arcade}
            genresSelected={genresSelected}
            setGenresSelected={setGenresSelected}
          />
          <GenreCard
            image={boardImg}
            genre={ZkNoidGameGenre.BoardGames}
            genresSelected={genresSelected}
            setGenresSelected={setGenresSelected}
          />
          <GenreCard
            image={luckyImg}
            genre={ZkNoidGameGenre.Lucky}
            genresSelected={genresSelected}
            setGenresSelected={setGenresSelected}
          />
          <GenreCard
            image={soonImg}
            genre={ZkNoidGameGenre.ComingSoon}
            genresSelected={genresSelected}
            setGenresSelected={setGenresSelected}
          />
        </div>
      </div>
      <div className="flex gap-5">
        <div className="min-w-[350px]">
          <div className="pb-5 pt-2 text-headline-3 font-bold">Filtration</div>
          <div className="flex flex-col gap-3">
            <FiltrationBox
              key={0}
              expanded={true}
              title="Genre"
              items={ALL_GAME_GENRES}
              itemsSelected={genresSelected}
              setItemsSelected={setGenresSelected}
            />
            <FiltrationBox
              key={1}
              expanded={false}
              title="Features"
              items={ALL_GAME_FEATURES}
              itemsSelected={featuresSelected}
              setItemsSelected={setFeaturesSelected}
            />
            <div
              className="flex h-[40px] cursor-pointer items-center justify-center rounded-[5px] border-2 border-left-accent bg-left-accent text-buttons text-dark-buttons-text hover:bg-bg-dark hover:text-left-accent"
              onClick={() => {
                setGenresSelected([]);
                setFeaturesSelected([]);
                setEventTypesSelected([]);
              }}
            >
              Reset filters
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className={'flex w-full flex-row items-center justify-between'}>
            <div className="text-headline-1">Games</div>
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
          <div className="flex flex-row gap-3 ">
            {ALL_GAME_TAGS.map((x) => (
              <div
                key={x.name}
                className={clsx(
                  'cursor-pointer rounded border p-1 font-plexsans text-filtration-buttons',
                  genresSelected == x.genres && featuresSelected == x.features
                    ? 'border-left-accent bg-left-accent text-bg-dark'
                    : 'hover:border-left-accent hover:text-left-accent'
                )}
                onClick={() => {
                  if (
                    genresSelected == x.genres &&
                    featuresSelected == x.features
                  ) {
                    setGenresSelected([]);
                    setFeaturesSelected([]);
                  } else {
                    setGenresSelected(x.genres);
                    setFeaturesSelected(x.features);
                  }
                }}
              >
                {x.name}
              </div>
            ))}
          </div>
          <div>
            <div className="grid grid-cols-3 gap-5">
              {games
                .filter(
                  (x) =>
                    genresSelected.includes(x.genre) ||
                    genresSelected.length == 0
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
      <Competitions />
    </div>
  );
};
