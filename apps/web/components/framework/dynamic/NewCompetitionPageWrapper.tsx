'use client';

import { useEffect, useMemo } from 'react';
import { zkNoidConfig } from '@/games/config';
import ZkNoidGameContext from '@/lib/contexts/ZkNoidGameContext';
import { useNetworkStore } from '@/lib/stores/network';

export default function Page({ gameId }: { gameId: string }) {
  const config = useMemo(
    () => zkNoidConfig.games.find((game) => game.id == gameId)!,
    []
  );
  const appchainSupported = Object.keys(config.runtimeModules).length > 0;
  const networkStore = useNetworkStore();

  const client = useMemo(() => zkNoidConfig.getClient(), []);

  useEffect(() => {
    if (appchainSupported) {
      client.start().then(() => networkStore.onProtokitClientStarted());
    }
  }, [client]);

  const NewCompetitionPage = config.pageNewCompetition!;

  return (
    <ZkNoidGameContext.Provider value={{
      client,
      appchainSupported: !!config.runtimeModules,
      buildLocalClient: false
    }}>
      <NewCompetitionPage />
    </ZkNoidGameContext.Provider>
  );
}
