'use client';

import { useMemo } from 'react';
import { zkNoidConfig } from '@/games/config';
import ZkNoidGameContext from '@/lib/contexts/ZkNoidGameContext';

export default function Page({ gameId }: { gameId: string }) {
  const config = useMemo(
    () => zkNoidConfig.games.find((game) => game.id == gameId)!,
    []
  );
  const client = useMemo(() => zkNoidConfig.getClient(), []);

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
