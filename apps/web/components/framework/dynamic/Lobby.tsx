'use client';

import { useMemo } from 'react';

import { zkNoidConfig } from '@/games/config';
import AppChainClientContext from '@/lib/contexts/AppChainClientContext';

export default function Page({
  gameId,
  lobbyId,
}: {
  gameId: string;
  lobbyId: string;
}) {
  const config = useMemo(
    () => zkNoidConfig.games.find((game) => game.id == gameId)!,
    []
  );
  const client = useMemo(() => zkNoidConfig.getClient(), []);

  const Lobby = config.lobby!;

  return (
    <AppChainClientContext.Provider value={client}>
      <Lobby params={{ lobbyId: lobbyId }} />
    </AppChainClientContext.Provider>
  );
}
