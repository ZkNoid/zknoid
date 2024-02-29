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

export const GameStore = ({ games }: { games: IGame[] }) => {
  const [eventTypesSelected, setEventTypesSelected] = useState<
    ZkNoidEventType[]
  >([]);
  const [genresSelected, setGenresSelected] = useState<ZkNoidGameGenre[]>([]);
  const [featuresSelected, setFeaturesSelected] = useState<ZkNoidGameFeature[]>(
    []
  );

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
              className="flex h-[40px] cursor-pointer items-center justify-center rounded-2xl border-2 border-left-accent text-buttons text-left-accent"
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
          <div className="text-headline-1">Games</div>
          <div className="flex flex-row gap-3 ">
            {ALL_GAME_TAGS.map((x) => (
              <div
                key={x.name}
                className={`cursor-pointer rounded border p-1 font-plexsans text-filtration-buttons ${
                  genresSelected == x.genres && featuresSelected == x.features
                    ? 'border-left-accent bg-left-accent text-bg-dark'
                    : 'border-[#F9F8F4]'
                }`}
                onClick={() => {
                  setGenresSelected(x.genres);
                  setFeaturesSelected(x.features);
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
        </div>
      </div>
    </div>
  );
};
