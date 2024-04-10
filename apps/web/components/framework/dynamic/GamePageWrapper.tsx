'use client';

import { useEffect, useMemo } from 'react';

import { zkNoidConfig } from '@/games/config';
import AppChainClientContext from '@/lib/contexts/AppChainClientContext';
import { api } from '@/trpc/react';
import { useNetworkStore } from '@/lib/stores/network';
import { getEnvContext } from '@/lib/envContext';

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
  const networkStore = useNetworkStore();
  const logGameOpenedMutation = api.logging.logGameOpened.useMutation();

  useEffect(() => {
    if (networkStore.address) {
      logGameOpenedMutation.mutate({
        userAddress: networkStore.address,
        gameId,
        envContext: getEnvContext()
      });
    }
  }, [networkStore.address])

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
