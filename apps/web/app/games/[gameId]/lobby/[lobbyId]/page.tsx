'use client';
import 'reflect-metadata';

import dynamic from 'next/dynamic';

const Lobby = dynamic(() => import('@/components/framework/dynamic/Lobby'), {
  ssr: false,
});

export default function Home({
  params,
}: {
  params: { gameId: string; lobbyId: string };
}) {
  return <Lobby gameId={params.gameId} lobbyId={params.lobbyId} />;
}
