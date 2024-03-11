'use client';

import "reflect-metadata";

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Footer } from '@/components/Footer';
import DesktopNavbar from '@/components/ui/games-store/DesktopNavbar';
import { Section1 } from '@/components/ui/games-store/Section1';
import { Section2 } from '@/components/ui/games-store/Section2';
import { IGame, announcedGames, defaultGames } from './constants/games';

const zkNoidConfig = import('@/games/config');

const StoreProtokitUpdater = dynamic(
  () => import('@/components/ui/games-store/StoreProtokitUpdater'),
  {
    ssr: false,
  }
);

export default function Home() {
  const [games, setGames] = useState<IGame[]>(
    defaultGames.concat(announcedGames)
  );

  useEffect(() => {
    zkNoidConfig.then((zkNoidGames) => {
      setGames(
        (
          zkNoidGames.zkNoidConfig.games.map((x) => ({
            id: x.id,
            logo: x.image,
            rating: x.rating,
            name: x.name,
            description: x.description,
            genre: x.genre,
            features: x.features,
            tags: [],
            defaultPage: x.pageCompetitionsList
              ? 'competitions-list'
              : 'global',
            active: true,
            isReleased: x.isReleased,
            releaseDate: x.releaseDate,
            popularity: x.popularity,
          })) as IGame[]
        ).concat(announcedGames)
      );
    });
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <StoreProtokitUpdater />
      <DesktopNavbar autoconnect={true} />

      <main className="flex flex-col px-5">
        <Section1 />
        <Section2 games={games} />
      </main>
      <Footer />
    </div>
  );
}
