'use client';

import dynamic from 'next/dynamic';

const GamePage = dynamic(() => import("@/games/arkanoid/page"), {
    ssr: false,
  });

export default function Home({ params }: { params: { competitionId: string } }) {
    return (
        <GamePage params={params} />
    )
}
