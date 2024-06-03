import {
  ALL_GAME_EVENT_TYPES,
  GAME_EVENTS,
  getEventType,
  ZkNoidEventType,
} from '@/lib/platform/game_events';
import { FilterCard } from '@/components/ui/games-store/widgets/GameStore/FilterCard';
import { EventCard } from '@/components/ui/games-store/widgets/GameStore/EventCard';
import { GenreCard } from '@/components/ui/games-store/widgets/GameStore/GenreCard';
import {
  ALL_GAME_FEATURES,
  ALL_GAME_GENRES,
  ALL_GAME_TAGS,
  ZkNoidGameFeature,
  ZkNoidGameGenre,
} from '@/lib/platform/game_tags';
import { FiltrationBox } from '@/components/ui/games-store/widgets/GameStore/FiltrationBox';
import { GameCard } from '@/components/ui/games-store/GameCard';
import { useEffect, useState } from 'react';
import { IGame } from '@/app/constants/games';
import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { GAME_STORE_SORT_METHODS, GameStoreSortBy } from '@/constants/sortBy';
import ChessIllustration from './assets/Chess_Illustration.json';
import CubesIllustration from './assets/Cubes_Illustration.json';
import EyesIllustration from './assets/Eyes_Illustration_01_01.json';
import GamepadIllustration from './assets/Gamepad_Illustration_01_01.json';
import Lottie from 'react-lottie';
import SnakeNoEvents from './assets/ZKNoid_Snake_Intro_03_05.json';
import { Pagination } from '@/components/ui/games-store/shared/Pagination';
import { SortByFilter } from '@/components/ui/games-store/SortByFilter';

export const GameStore = ({ games }: { games: IGame[] }) => {
  const PAGINATION_LIMIT = 9;

  const [eventTypesSelected, setEventTypesSelected] = useState<
    ZkNoidEventType[]
  >([]);
  const [genresSelected, setGenresSelected] = useState<ZkNoidGameGenre[]>([]);
  const [featuresSelected, setFeaturesSelected] = useState<ZkNoidGameFeature[]>(
    []
  );

  // const mapSettings = api.favorites.getFavoriteGames.useQuery({});

  // console.log('Map settings', mapSettings);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [sortBy, setSortBy] = useState<GameStoreSortBy>(
    GameStoreSortBy.RatingLow
  );

  const filteredEvents = GAME_EVENTS.filter(
    (x) =>
      (eventTypesSelected.includes(getEventType(x)) ||
        eventTypesSelected.length == 0) &&
      x.eventEnds > Date.now()
  );
  const sortByFilter = (a: IGame, b: IGame) => {
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

  const filteredGames = games.filter((x) => {
    if (genresSelected.length == 0 && featuresSelected.length == 0) return true;
    if (genresSelected.includes(x.genre)) return true;
    if (x.features.some((feature) => featuresSelected.includes(feature)))
      return true;
  });

  const renderGames = filteredGames.slice(
    (currentPage - 1) * PAGINATION_LIMIT,
    currentPage * PAGINATION_LIMIT
  );

  useEffect(() => {
    const updateAnimationHeights = () => {
      const innerWidth = window.innerWidth;
      setAnimationHeights(
        innerWidth <= 1024 ? [300, 250, 250, 250] : [500, 450, 450, 500]
      );
    };

    window.addEventListener('resize', updateAnimationHeights);
    updateAnimationHeights();

    return () => window.removeEventListener('resize', updateAnimationHeights);
  }, []);

  return (
    <div className="top-0 mb-[100px] flex h-full w-full flex-col gap-5 p-4 lg:p-10">
      <div className="flex flex-col gap-5">
        <div className="pb-3 text-headline-2 lg:text-headline-1">
          Events & competitions
        </div>
        <div className="flex flex-row flex-wrap gap-3 lg:flex-nowrap">
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
        {filteredEvents.length == 0 && (
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
        {filteredEvents.length > 0 && (
          <div className={'grid grid-cols-1 gap-5 lg:grid-cols-2'}>
            {filteredEvents.map((event) => (
              <EventCard
                key={event.name}
                headText={event.name}
                description={event.description}
                event={event}
                image={event.image}
              />
            ))}
          </div>
        )}
      </div>

      <div className={'mb-0 mt-20'}>
        <div className="pb-3 text-headline-2 lg:text-headline-1">
          Popular genres
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
          <GenreCard
            animation={GamepadIllustration}
            genre={ZkNoidGameGenre.Arcade}
            genresSelected={genresSelected}
            setGenresSelected={setGenresSelected}
            setSortBy={setSortBy}
          />
          <GenreCard
            animation={ChessIllustration}
            genre={ZkNoidGameGenre.BoardGames}
            genresSelected={genresSelected}
            setGenresSelected={setGenresSelected}
            setSortBy={setSortBy}
          />
          <GenreCard
            animation={CubesIllustration}
            genre={ZkNoidGameGenre.Lucky}
            genresSelected={genresSelected}
            setGenresSelected={setGenresSelected}
            setSortBy={setSortBy}
          />
          <GenreCard
            animation={EyesIllustration}
            sortBy={GameStoreSortBy.ComingSoon}
            genresSelected={[]}
            setSortBy={setSortBy}
          />
          {/* <div
            className="relative flex h-full w-full flex-col items-center justify-center p-5"
            onClick={() => {
              setSortBy(GameStoreSortBy.ComingSoon);
            }}
          >
            <div className="z-1 absolute bottom-0 left-0 -z-10 h-[60%] w-full rounded bg-[#252525]"></div>
            <div className="h-[15.595vw] w-full">
              <Lottie
                options={{
                  animationData: EyesIllustration,
                  rendererSettings: {
                    className: `z-0 mt-[0px]`,
                  },
                }}
                height={animationHeights[3]}
                isClickToPauseDisabled={true}
              ></Lottie>
            </div>

            <div className="z-0 text-main lg:text-headline-3">Coming Soon</div>
          </div> */}
        </div>
      </div>
      <div className="flex gap-5">
        <div className="hidden min-w-[350px] max-[2000px]:min-w-[280px] lg:block">
          <div className="pb-5 pt-2 text-headline-3 font-bold">Filtration</div>
          <div className="flex flex-col gap-3">
            <FiltrationBox
              key={0}
              defaultExpanded={true}
              title="Genre"
              items={ALL_GAME_GENRES}
              itemsSelected={genresSelected}
              setItemsSelected={setGenresSelected}
            />
            <FiltrationBox
              key={1}
              defaultExpanded={false}
              title="Features"
              items={ALL_GAME_FEATURES}
              itemsSelected={featuresSelected}
              setItemsSelected={setFeaturesSelected}
            />
            <AnimatePresence initial={false} mode={'wait'}>
              {genresSelected.length != 0 ||
              featuresSelected.length != 0 ||
              eventTypesSelected.length != 0 ? (
                <motion.div
                  className="flex h-[40px] cursor-pointer items-center justify-center rounded-[5px] border-2 border-left-accent bg-left-accent text-buttons text-dark-buttons-text hover:bg-bg-dark hover:text-left-accent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => {
                    setGenresSelected([]);
                    setFeaturesSelected([]);
                    setEventTypesSelected([]);
                  }}
                >
                  Reset filters
                </motion.div>
              ) : undefined}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex w-full flex-col gap-6">
          <div className={'flex w-full flex-row items-center justify-between'}>
            <div className="text-headline-2 lg:text-headline-1">Games</div>
            <SortByFilter
              sortMethods={GAME_STORE_SORT_METHODS}
              sortBy={sortBy}
              setSortBy={setSortBy}
              className={'hidden lg:block'}
            />
          </div>
          <div className="hidden flex-row gap-3 lg:flex">
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
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:max-[1700px]:grid-cols-2">
              {renderGames
                .sort((a, b) => sortByFilter(a, b))
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
                  pagesAmount={Math.ceil(
                    filteredGames.length / PAGINATION_LIMIT
                  )}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              </motion.div>
            ) : undefined}
          </AnimatePresence>
        </div>
      </div>
      {/* <Competitions
        competitions={[
          {
            game: {
              id: defaultGames[0].id,
              genre: defaultGames[0].genre,
              rules: '',
            },
            title: 'Default-0',
            id: 0,
            preReg: false,
            preRegDate: {
              start: new Date(1970, 0, 1),
              end: new Date(1970, 0, 1),
            },
            competitionDate: {
              start: new Date(1970, 0, 1),
              end: new Date(1970, 0, 1),
            },
            participationFee: 0n,
            currency: Currency.MINA,
            reward: 0n,
            seed: 0,
            registered: false,
          },
          {
            game: {
              id: defaultGames[0].id,
              genre: defaultGames[0].genre,
              rules: '',
            },
            title: 'Default-1',
            id: 1,
            preReg: false,
            preRegDate: {
              start: new Date(1970, 0, 1),
              end: new Date(1970, 0, 1),
            },
            competitionDate: {
              start: new Date(1970, 0, 1),
              end: new Date(1970, 0, 1),
            },
            participationFee: 0n,
            currency: Currency.MINA,
            reward: 0n,
            seed: 0,
            registered: false,
          },
          {
            game: {
              id: defaultGames[0].id,
              genre: defaultGames[0].genre,
              rules: '',
            },
            title: 'Default-2',
            id: 2,
            preReg: false,
            preRegDate: {
              start: new Date(1970, 0, 1),
              end: new Date(1970, 0, 1),
            },
            competitionDate: {
              start: new Date(1970, 0, 1),
              end: new Date(1970, 0, 1),
            },
            participationFee: 0n,
            currency: Currency.MINA,
            reward: 0n,
            seed: 0,
            registered: false,
          },
        ]}
      /> */}
    </div>
  );
};
