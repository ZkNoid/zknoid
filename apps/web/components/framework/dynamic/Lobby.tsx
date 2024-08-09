'use client';

import { useEffect, useMemo } from 'react';

import { zkNoidConfig } from '@/games/config';
import AppChainClientContext from '@/lib/contexts/AppChainClientContext';
import { useNetworkStore } from '@/lib/stores/network';

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
  const networkStore = useNetworkStore();

  const Lobby = config.lobby!;

  useEffect(() => {
    client.start().then(() => networkStore.onProtokitClientStarted());
  }, [client]);

  return (
    <AppChainClientContext.Provider value={client}>
      <Lobby params={{ lobbyId: lobbyId }} />
    </AppChainClientContext.Provider>
  );
}
