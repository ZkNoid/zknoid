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
import { useState } from 'react';
import { defaultGames, IGame } from '@/app/constants/games';
import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { GAME_STORE_SORT_METHODS, GameStoreSortBy } from '@/constants/sortBy';
import { Competitions } from '@/components/ui/games-store/widgets/GameStore/Competitions';
import ChessIllustration from './assets/Chess_Illustration_01_02.json';
import CubesIllustration from './assets/Cubes_Illustration_01_02.json';
import EyesIllustration from './assets/Eyes_Illustration_01_01.json';
import GamepadIllustration from './assets/Gamepad_Illustration_01_01.json';
import Lottie from 'react-lottie';
import SnakeNoEvents from './assets/ZKNoid_Snake_Intro_03_05.json';
import { Pagination } from '@/components/ui/games-store/shared/Pagination';
import { SortByFilter } from '@/components/ui/games-store/SortByFilter';

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

  const [sortBy, setSortBy] = useState<GameStoreSortBy>(
    GameStoreSortBy.RatingLow
  );

  const filteredEvents = GAME_EVENTS.filter(
    (x) =>
      eventTypesSelected.includes(getEventType(x)) ||
      eventTypesSelected.length == 0
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
    <div className="top-0 mb-[100px] flex h-full w-full flex-col gap-5 p-10">
      <div className="flex flex-col gap-5">
        <div className="pb-3 text-headline-1">Events & competitions</div>
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
          <div className="grid min-h-[352px] grid-cols-2 gap-5">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.name}
                headText={event.name}
                description={event.description}
                event={event}
              />
            ))}
          </div>
        )}

        <div className={'grid grid-cols-2 gap-5'}>
          <motion.div
            className={
              'group relative mr-[11.2%] flex flex-row justify-between rounded-[5px] border border-left-accent'
            }
            variants={{
              visible: {
                background:
                  'linear-gradient(to right, #D2FF00 100%, #212121 100%)',
                transition: { duration: 0.5, delayChildren: 0.5 },
              },
            }}
            whileHover={'visible'}
          >
            <div
              className={
                'w-full p-4 pt-5 uppercase text-left-accent group-hover:text-dark-buttons-text'
              }
            >
              Show me the all existion competitions
            </div>
            <div
              className={
                'rounded-[5px] bg-left-accent p-4 group-hover:bg-bg-dark'
              }
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_2952_1406)">
                  <path
                    d="M7 0H4C2.93913 0 1.92172 0.421427 1.17157 1.17157C0.421427 1.92172 0 2.93913 0 4L0 7C0 8.06087 0.421427 9.07828 1.17157 9.82843C1.92172 10.5786 2.93913 11 4 11H7C8.06087 11 9.07828 10.5786 9.82843 9.82843C10.5786 9.07828 11 8.06087 11 7V4C11 2.93913 10.5786 1.92172 9.82843 1.17157C9.07828 0.421427 8.06087 0 7 0V0ZM9 7C9 7.53043 8.78929 8.03914 8.41421 8.41421C8.03914 8.78929 7.53043 9 7 9H4C3.46957 9 2.96086 8.78929 2.58579 8.41421C2.21071 8.03914 2 7.53043 2 7V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H7C7.53043 2 8.03914 2.21071 8.41421 2.58579C8.78929 2.96086 9 3.46957 9 4V7Z"
                    fill="#212121"
                    className={'group-hover:fill-left-accent'}
                  />
                  <path
                    d="M20 0H17C15.9391 0 14.9217 0.421428 14.1716 1.17157C13.4214 1.92172 13 2.93914 13 4V7C13 8.06087 13.4214 9.07829 14.1716 9.82843C14.9217 10.5786 15.9391 11 17 11H20C21.0609 11 22.0783 10.5786 22.8284 9.82843C23.5786 9.07829 24 8.06087 24 7V4C24 2.93914 23.5786 1.92172 22.8284 1.17157C22.0783 0.421428 21.0609 0 20 0V0ZM22 7C22 7.53044 21.7893 8.03915 21.4142 8.41422C21.0391 8.78929 20.5304 9.00001 20 9.00001H17C16.4696 9.00001 15.9609 8.78929 15.5858 8.41422C15.2107 8.03915 15 7.53044 15 7V4C15 3.46957 15.2107 2.96086 15.5858 2.58579C15.9609 2.21072 16.4696 2 17 2H20C20.5304 2 21.0391 2.21072 21.4142 2.58579C21.7893 2.96086 22 3.46957 22 4V7Z"
                    fill="#212121"
                    className={'group-hover:fill-left-accent'}
                  />
                  <path
                    d="M7 13H4C2.93913 13 1.92172 13.4214 1.17157 14.1716C0.421427 14.9217 0 15.9391 0 17L0 20C0 21.0609 0.421427 22.0783 1.17157 22.8284C1.92172 23.5786 2.93913 24 4 24H7C8.06087 24 9.07828 23.5786 9.82843 22.8284C10.5786 22.0783 11 21.0609 11 20V17C11 15.9391 10.5786 14.9217 9.82843 14.1716C9.07828 13.4214 8.06087 13 7 13ZM9 20C9 20.5304 8.78929 21.0392 8.41421 21.4142C8.03914 21.7893 7.53043 22 7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0392 2 20.5304 2 20V17C2 16.4696 2.21071 15.9609 2.58579 15.5858C2.96086 15.2107 3.46957 15 4 15H7C7.53043 15 8.03914 15.2107 8.41421 15.5858C8.78929 15.9609 9 16.4696 9 17V20Z"
                    fill="#212121"
                    className={'group-hover:fill-left-accent'}
                  />
                  <path
                    d="M20 13H17C15.9391 13 14.9217 13.4214 14.1716 14.1716C13.4214 14.9217 13 15.9391 13 17V20C13 21.0609 13.4214 22.0783 14.1716 22.8284C14.9217 23.5786 15.9391 24 17 24H20C21.0609 24 22.0783 23.5786 22.8284 22.8284C23.5786 22.0783 24 21.0609 24 20V17C24 15.9391 23.5786 14.9217 22.8284 14.1716C22.0783 13.4214 21.0609 13 20 13ZM22 20C22 20.5304 21.7893 21.0392 21.4142 21.4142C21.0391 21.7893 20.5304 22 20 22H17C16.4696 22 15.9609 21.7893 15.5858 21.4142C15.2107 21.0392 15 20.5304 15 20V17C15 16.4696 15.2107 15.9609 15.5858 15.5858C15.9609 15.2107 16.4696 15 17 15H20C20.5304 15 21.0391 15.2107 21.4142 15.5858C21.7893 15.9609 22 16.4696 22 17V20Z"
                    fill="#212121"
                    className={'group-hover:fill-left-accent'}
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2952_1406">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </motion.div>
          <motion.div
            className={
              'group relative mr-[11.2%] flex flex-row justify-between rounded-[5px] border border-left-accent'
            }
            variants={{
              visible: {
                background:
                  'linear-gradient(to right, #D2FF00 100%, #212121 100%)',
                transition: { duration: 0.5, delayChildren: 0.5 },
              },
            }}
            whileHover={'visible'}
          >
            <div
              className={
                'w-full p-4 pt-5 uppercase text-left-accent group-hover:text-dark-buttons-text'
              }
            >
              Create your own competition!
            </div>
            <div
              className={
                'rounded-[5px] bg-left-accent p-4 group-hover:bg-bg-dark'
              }
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 25 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.9822 4.79724H9.69879C9.38351 4.79818 9.07587 4.89429 8.81615 5.07303C8.55643 5.25177 8.35675 5.50476 8.24324 5.79892L7.57024 7.53617L5.25387 8.85088L3.40703 8.56915C3.09953 8.52742 2.78655 8.57803 2.50786 8.71459C2.22918 8.85114 1.99739 9.06747 1.84192 9.33606L1.21589 10.4316C1.05547 10.7045 0.981555 11.0196 1.00391 11.3354C1.02626 11.6511 1.14383 11.9527 1.3411 12.2002L2.51492 13.6558V16.2852L1.3724 17.7407C1.17513 17.9883 1.05756 18.2898 1.03521 18.6056C1.01286 18.9213 1.08677 19.2364 1.24719 19.5093L1.87323 20.6048C2.0287 20.8734 2.26049 21.0897 2.53915 21.2263C2.81784 21.3629 3.13084 21.4135 3.43834 21.3718L5.28518 21.0901L7.57024 22.4047L8.24324 24.142C8.35675 24.4361 8.55643 24.6892 8.81615 24.868C9.07587 25.0466 9.38351 25.1428 9.69879 25.1437H11.0135C11.3288 25.1428 11.6364 25.0466 11.8961 24.868C12.1559 24.6892 12.3555 24.4361 12.469 24.142L13.142 22.4047L15.4271 21.0901L17.2739 21.3718C17.5814 21.4135 17.8944 21.3629 18.1731 21.2263C18.4518 21.0897 18.6837 20.8734 18.8391 20.6048L19.4651 19.5093C19.6256 19.2364 19.6994 18.9213 19.6771 18.6056C19.6547 18.2898 19.5372 17.9883 19.3399 17.7407L18.1661 16.2852V14.5898M7.21026 14.9705C7.21026 15.5896 7.39385 16.1947 7.73781 16.7095C8.08176 17.2243 8.57062 17.6255 9.1426 17.8624C9.71457 18.0993 10.344 18.1613 10.9512 18.0405C11.5584 17.9197 12.1161 17.6216 12.5539 17.1839C12.9917 16.7461 13.2898 16.1883 13.4106 15.5811C13.5313 14.9739 13.4694 14.3445 13.2324 13.7726C12.9955 13.2006 12.5943 12.7117 12.0795 12.3678C11.5648 12.0238 10.9596 11.8402 10.3405 11.8402C9.5103 11.8402 8.71411 12.17 8.12708 12.7571C7.54005 13.3441 7.21026 14.1403 7.21026 14.9705Z"
                  stroke="#212121"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={'group-hover:stroke-left-accent'}
                />
                <path
                  d="M13.4302 6.61253C12.8566 6.51275 12.8566 5.68937 13.4302 5.58958C15.5081 5.22808 17.1608 3.64535 17.6118 1.585L17.6463 1.42706C17.7706 0.86019 18.5776 0.856661 18.7067 1.42243L18.7487 1.60648C19.2165 3.65712 20.8695 5.22647 22.9418 5.58698C23.5183 5.68728 23.5183 6.51484 22.9418 6.61514C20.8695 6.97565 19.2165 8.545 18.7487 10.5956L18.7067 10.7797C18.5776 11.3455 17.7706 11.3419 17.6463 10.7751L17.6118 10.6171C17.1608 8.55677 15.5081 6.97404 13.4302 6.61253Z"
                  stroke="#212121"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={'group-hover:stroke-left-accent'}
                />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>

      <div className={'my-20'}>
        <div className="text-headline-1">Popular genres</div>
        <div className="grid grid-cols-4 gap-5">
          <GenreCard
            animation={GamepadIllustration}
            genre={ZkNoidGameGenre.Arcade}
            genresSelected={genresSelected}
            setGenresSelected={setGenresSelected}
          />
          <GenreCard
            animation={ChessIllustration}
            genre={ZkNoidGameGenre.BoardGames}
            genresSelected={genresSelected}
            setGenresSelected={setGenresSelected}
            height={450}
            className={'max-[2000px]:mt-[25px]'}
          />
          <GenreCard
            animation={CubesIllustration}
            genre={ZkNoidGameGenre.Lucky}
            genresSelected={genresSelected}
            setGenresSelected={setGenresSelected}
            height={450}
            className={'mt-[35px] max-[2000px]:mt-[50px]'}
          />
          <div
            className="relative flex h-full w-full flex-col items-center justify-center p-5"
            onClick={() => {
              setSortBy(GameStoreSortBy.ComingSoon);
            }}
          >
            <div className="z-1 absolute bottom-0 left-0 -z-10 h-[60%] w-full rounded bg-[#252525]"></div>
            <div className="h-full w-full">
              <Lottie
                options={{
                  animationData: EyesIllustration,
                  rendererSettings: {
                    className: `z-0 h-full mt-[80px]`,
                  },
                }}
                height={500}
              ></Lottie>
            </div>

            <div className="z-0 text-headline-3">Coming Soon</div>
          </div>
        </div>
      </div>
      <div className="flex gap-5">
        <div className="min-w-[350px] max-[2000px]:min-w-[280px]">
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
            <div className="text-headline-1">Games</div>
            <SortByFilter
              sortMethods={GAME_STORE_SORT_METHODS}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </div>
          <div className="flex flex-row gap-3">
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
            <div className="grid grid-cols-3 gap-5 max-[1700px]:grid-cols-2">
              {games
                .filter((x) => {
                  if (
                    genresSelected.length == 0 &&
                    featuresSelected.length == 0
                  )
                    return true;
                  if (genresSelected.includes(x.genre)) return true;
                  if (
                    x.features.some((feature) =>
                      featuresSelected.includes(feature)
                    )
                  )
                    return true;
                })
                .sort((a, b) => sortByFliter(a, b))
                .map((game, index) => (
                  <GameCard
                    game={game}
                    key={game.id}
                    fullImageW={game.id === 'arkanoid'}
                    fullImageH={game.id === 'arkanoid'}
                    color={
                      Number.isInteger(index / 3)
                        ? 1
                        : index === 1 || Number.isInteger(index - 1 / 3)
                          ? 2
                          : 3
                    }
                  />
                ))}
            </div>
          </div>

          <AnimatePresence initial={false} mode={'wait'}>
            {featuresSelected.length != 0 ||
            genresSelected.length != 0 ||
            eventTypesSelected.length != 0 ? (
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
      <Competitions
        competitions={[
          {
            game: defaultGames[0],
            title: 'Arcanoid',
            index: 1,
            preRegDate: {
              start: new Date(2024, 2, 15),
              end: new Date(2024, 2, 20),
            },
            competitionsDate: {
              start: new Date(2024, 2, 15),
              end: new Date(2024, 2, 20),
            },
            participantsFee: 5,
            currency: '$MINA',
            reward: 1000,
          },
          {
            game: defaultGames[0],
            title: 'Arcanoid',
            index: 3,
            preRegDate: {
              start: new Date(2024, 2, 15),
              end: new Date(2024, 2, 20),
            },
            competitionsDate: {
              start: new Date(2024, 2, 15),
              end: new Date(2024, 2, 20),
            },
            participantsFee: 20,
            currency: '$MINA',
            reward: 500,
          },
          {
            game: defaultGames[1],
            title: 'Randzu battle',
            index: 4,
            preRegDate: {
              start: new Date(2024, 2, 15),
              end: new Date(2024, 2, 20),
            },
            competitionsDate: {
              start: new Date(2024, 2, 15),
              end: new Date(2024, 2, 20),
            },
            participantsFee: 1,
            currency: '$MINA',
            reward: 1000,
          },
          {
            game: defaultGames[1],
            title: '****** **** *******',
            index: 5,
            preRegDate: {
              start: new Date(2024, 2, 6),
              end: new Date(2024, 2, 20),
            },
            competitionsDate: {
              start: new Date(2024, 3, 1),
              end: new Date(2024, 3, 6),
            },
            participantsFee: 10,
            currency: '$MINA',
            reward: 10000,
          },
          {
            game: defaultGames[1],
            title: 'Superbattle',
            index: 5,
            preRegDate: {
              start: new Date(2024, 1, 9),
              end: new Date(2024, 1, 20),
            },
            competitionsDate: {
              start: new Date(2024, 1, 21),
              end: new Date(2024, 1, 26),
            },
            participantsFee: 99,
            currency: '$MINA',
            reward: 4999,
          },
        ]}
      />
    </div>
  );
};
