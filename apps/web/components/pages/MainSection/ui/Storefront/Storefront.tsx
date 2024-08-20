import { useState } from 'react';
import { GameStoreSortBy } from '@/components/widgets/GameStore/lib/sortBy';
import { ZkNoidGameFeature, ZkNoidGameGenre } from '@/lib/platform/game_tags';
import { ZkNoidEventType } from '@/lib/platform/game_events';
import Events from './ui/Events';
import GenresFilter from './ui/GenresFilter';
import GameStore from './ui/GameStore';

export default function Storefront() {
  const [sortBy, setSortBy] = useState<GameStoreSortBy>(
    GameStoreSortBy.RatingLow
  );
  const [genresSelected, setGenresSelected] = useState<ZkNoidGameGenre[]>([]);
  const [eventTypesSelected, setEventTypesSelected] = useState<
    ZkNoidEventType[]
  >([]);
  const [featuresSelected, setFeaturesSelected] = useState<ZkNoidGameFeature[]>(
    []
  );
  return (
    <div
      className={
        '-z-[5] mt-[3.646vw] h-full w-full rounded-[2.604vw] border-2 border-left-accent bg-bg-grey p-[2.083vw]'
      }
    >
      <Events
        eventTypesSelected={eventTypesSelected}
        setEventTypesSelected={setEventTypesSelected}
      />
      <GenresFilter
        genresSelected={genresSelected}
        setGenresSelected={setGenresSelected}
        setSortBy={setSortBy}
      />
      <GameStore
        sortBy={sortBy}
        setSortBy={setSortBy}
        genresSelected={genresSelected}
        setGenresSelected={setGenresSelected}
        featuresSelected={featuresSelected}
        setFeaturesSelected={setFeaturesSelected}
        eventTypesSelected={eventTypesSelected}
        setEventTypesSelected={setEventTypesSelected}
      />
    </div>
  );
}
