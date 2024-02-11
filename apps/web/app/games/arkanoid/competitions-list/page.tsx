'use client';

import dynamic from 'next/dynamic';

const GamePage = dynamic(() => import("@/games/arkanoid/page-competitions-list"), {
  ssr: false,
});

export default function Home() {
    return (
        <GamePage />
    )
}
