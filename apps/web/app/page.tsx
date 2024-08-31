'use client';

import 'reflect-metadata';
import { useEffect, useState } from 'react';
import Footer from '@/components/widgets/Footer/Footer';
import MainSection from '@/components/pages/MainSection';
import { IGame, announcedGames, defaultGames } from './constants/games';
import Header from '@/components/widgets/Header';
import ZkNoidGameContext from '@/lib/contexts/ZkNoidGameContext';

export default function Home() {
  const [games, setGames] = useState<IGame[]>(
    defaultGames.concat(announcedGames)
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
    <ZkNoidGameContext.Provider
      value={{
        client: undefined,
        appchainSupported: false,
        buildLocalClient: true,
      }}
    >
      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex flex-col px-5">
          <MainSection games={games} />
        </main>

        <Footer />

        {/*<ToastContainer />*/}
      </div>
    </ZkNoidGameContext.Provider>
  );
}
