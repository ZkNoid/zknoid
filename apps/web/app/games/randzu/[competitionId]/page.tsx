'use client';

import RandzuPage from '@/games/randzu/page';
import dynamic from 'next/dynamic';

const GamePage = dynamic(() => import("@/games/randzu/page"), {
    ssr: false,
  });

export default function Home({ params }: { params: { competitionId: string } }) {
    return (
        <GamePage params={params} />
    )
}
