'use client';

import { useEffect, useState } from 'react';
import { GameStoreSortBy } from '@/components/pages/MainSection/lib/sortBy';
import { ZkNoidGameFeature, ZkNoidGameGenre } from '@/lib/platform/game_tags';
import { ZkNoidEventType } from '@/lib/platform/game_events';
import Events from './ui/Events';
import GenresFilter from './ui/GenresFilter';
import GameStore from './ui/GameStore';
import { WidgetsSwitch } from './ui/WidgetsSwitch';
import { useSearchParams } from 'next/navigation';
import Faq from './ui/Faq';
import Favorites from './ui/Favorites';
import { announcedGames, defaultGames, IGame } from '@/app/constants/games';

export default function Storefront() {
  const searchParams = useSearchParams();
  const widget = searchParams.get('widget');

  const [games, setGames] = useState<IGame[]>(
    defaultGames.concat(announcedGames)
  );
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
  useEffect(() => {
    const zkNoidConfig = import('@/games/config');

    zkNoidConfig.then((zkNoidGames) => {
      setGames(
        (
          zkNoidGames.zkNoidConfig.games.map((x) => ({
            id: x.id,
            logo: x.image,
            logoMode: x.logoMode,
            name: x.name,
            description: x.description,
            genre: x.genre,
            features: x.features,
            tags: [],
            defaultPage: x.pageCompetitionsList
              ? 'competitions-list'
              : x.lobby
                ? 'lobby/undefined'
                : 'global',
            active: true,
            isReleased: x.isReleased,
            releaseDate: x.releaseDate,
            popularity: x.popularity,
            author: x.author,
            rules: x.rules,
            rating: 0,
            externalUrl: x.externalUrl,
          })) as IGame[]
        ).concat(announcedGames)
      );
    });
  }, []);
  return (
    <div
      className={
        'relative mt-[3.646vw] h-full w-full rounded-[2.604vw] border-2 border-left-accent bg-bg-grey p-[2.083vw]'
      }
    >
      <WidgetsSwitch />
      {widget == 'favorites' ? (
        <Favorites games={games} />
      ) : widget == 'faq' ? (
        <Faq />
      ) : (
        <>
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
            games={games}
            sortBy={sortBy}
            setSortBy={setSortBy}
            genresSelected={genresSelected}
            setGenresSelected={setGenresSelected}
            featuresSelected={featuresSelected}
            setFeaturesSelected={setFeaturesSelected}
            eventTypesSelected={eventTypesSelected}
            setEventTypesSelected={setEventTypesSelected}
          />
        </>
      )}
      {/*{widget == 'favorites' && <Favorites games={games} />}*/}
      {/*{widget == 'faq' && <Faq />}*/}
      {/*{!widget && (*/}
      {/*  */}
      {/*)}*/}
    </div>
  );
}
