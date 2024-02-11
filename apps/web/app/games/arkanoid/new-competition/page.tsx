'use client';

import dynamic from 'next/dynamic';

const GamePage = dynamic(() => import("@/games/arkanoid/page-new-competition"), {
  ssr: false,
});

export default function Home() {
    return (
        <GamePage />
    )
}
