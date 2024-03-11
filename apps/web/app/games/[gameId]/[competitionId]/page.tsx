'use client';
import 'reflect-metadata';

import dynamic from 'next/dynamic';

const GamePageWrapper = dynamic(
  () => import('@/components/framework/dynamic/GamePageWrapper'),
  {
    ssr: false,
  }
);

export default function Home({
  params,
}: {
  params: { competitionId: string; gameId: string };
}) {
  return (
    <GamePageWrapper
      gameId={params.gameId}
      competitionId={params.competitionId}
    />
  );
}
