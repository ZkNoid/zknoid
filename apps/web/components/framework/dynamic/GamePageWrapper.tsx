'use client';

import { useEffect, useMemo } from 'react';

import { zkNoidConfig } from '@/games/config';
import ZkNoidGameContext from '@/lib/contexts/ZkNoidGameContext';
import { api } from '@/trpc/react';
import { useNetworkStore } from '@/lib/stores/network';
import { getEnvContext } from '@/lib/envContext';

export default function GamePageWrapper({
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
  const appchainSupported = Object.keys(config.runtimeModules).length > 0;

  useEffect(() => {
    if (appchainSupported) {
      client.start().then(() => networkStore.onProtokitClientStarted());
    }
  }, [client]);

  useEffect(() => {
    if (networkStore.address) {
      logGameOpenedMutation.mutate({
        userAddress: networkStore.address,
        gameId,
        envContext: getEnvContext(),
      });
    }
  }, [networkStore.address]);

  return (
    <ZkNoidGameContext.Provider
      value={{
        client,
        appchainSupported,
        buildLocalClient: false,
      }}
    >
      <config.page
        params={{
          competitionId: competitionId,
        }}
      />
    </ZkNoidGameContext.Provider>
  );
}
