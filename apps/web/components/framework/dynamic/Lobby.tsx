'use client';

import { useEffect, useMemo } from 'react';

import { zkNoidConfig } from '@/games/config';
import ZkNoidGameContext from '@/lib/contexts/ZkNoidGameContext';
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
  const appchainSupported = Object.keys(config.runtimeModules).length > 0;

  const networkStore = useNetworkStore();

  const Lobby = config.lobby!;

  useEffect(() => {
    if (appchainSupported) {
      client.start().then(() => networkStore.onProtokitClientStarted());
    }
  }, [client]);

  return (
    <ZkNoidGameContext.Provider
      value={{
        client,
        appchainSupported,
        buildLocalClient: false,
      }}
    >
      <Lobby params={{ lobbyId: lobbyId }} />
    </ZkNoidGameContext.Provider>
  );
}
