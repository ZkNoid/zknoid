'use client';

import { useEffect, useMemo } from 'react';

import { zkNoidConfig } from '@/games/config';
import AppChainClientContext from '@/lib/contexts/AppChainClientContext';
import { useNetworkStore } from '@/lib/stores/network';

export default function Page({ gameId }: { gameId: string }) {
  const config = useMemo(
    () => zkNoidConfig.games.find((game) => game.id == gameId)!,
    []
  );
  const client = useMemo(() => zkNoidConfig.getClient(), []);
  const networkStore = useNetworkStore();

  useEffect(() => {
    client.start().then(() => networkStore.onProtokitClientStarted());
  }, [client]);

  const CompetitionsPage = config.pageCompetitionsList!;

  return (
    <AppChainClientContext.Provider value={client}>
      <CompetitionsPage />
    </AppChainClientContext.Provider>
  );
}
