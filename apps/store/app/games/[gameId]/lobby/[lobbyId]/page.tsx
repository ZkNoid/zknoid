'use client';
import 'reflect-metadata';

import dynamic from 'next/dynamic';
import { zkNoidConfig } from '@/games/config';

const Lobby = dynamic(() => import('sdk/components/framework/dynamic/Lobby'), {
  ssr: false,
});

export default function Home({
  params,
}: {
  params: { gameId: string; lobbyId: string };
}) {
  return <Lobby gameId={params.gameId} lobbyId={params.lobbyId} zkNoidConfig={zkNoidConfig}/>;
}
