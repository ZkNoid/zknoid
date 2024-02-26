'use client'

import { Footer } from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { IGame, announcedGames, defaultGames } from './constants/games';
import { useEffect, useState } from 'react';
import DesktopNavbar from '@/components/ui/games-store/DesktopNavbar';
import { SOCIALS } from '@/constants/socials';
import { Section1 } from '@/components/ui/games-store/Section1';
import { CentralBlock } from '@/components/ui/games-store/CentralBlock';
import { Section2 } from '@/components/ui/games-store/Section2';
import dynamic from 'next/dynamic';
const zkNoidConfig = import('@/games/config');

const StoreProtokitUpdater = dynamic(() => import("@/components/ui/games-store/StoreProtokitUpdater"), {
  ssr: false,
});

export default function Home() {
  const [games, setGames] = useState<IGame[]>(defaultGames.concat(announcedGames));

  useEffect(() => {
    zkNoidConfig.then(zkNoidGames => {
      setGames((zkNoidGames.zkNoidConfig.games.map(x => ({
        id: x.id,
        logo: x.image,
        name: x.name,
        description: x.description,
        genre: x.genre,
        tags: [],
        defaultPage: x.pageCompetitionsList ? 'competitions-list' : 'global',
        active: true
      })) as IGame[]).concat(announcedGames));
    });
  }, []);

  return (
    <div className='flex min-h-screen flex-col'>
      <StoreProtokitUpdater />
      <DesktopNavbar autoconnect={true} />

      <main className="px-5 flex flex-col">
        <Section1 />
        <CentralBlock />
        <Section2 games={games} />
      </main>
      <Footer />
    </div>
  );
}
