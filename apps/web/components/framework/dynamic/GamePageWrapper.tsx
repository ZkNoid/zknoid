'use client';

import { useMemo } from 'react';

import { zkNoidConfig } from '@/games/config';
import AppChainClientContext from '@/lib/contexts/AppChainClientContext';

export default function Page({
  gameId,
  competitionId,
}: {
  gameId: string;
  competitionId: string;
}) {
  const config = useMemo(
    () => zkNoidConfig.games.find((game) => game.id == gameId)!,
    []
  );
  const client = useMemo(() => zkNoidConfig.getClient(), []);

  return (
    <AppChainClientContext.Provider value={client}>
      <config.page
        params={{
          competitionId: competitionId,
        }}
      />
    </AppChainClientContext.Provider>
  );
}
