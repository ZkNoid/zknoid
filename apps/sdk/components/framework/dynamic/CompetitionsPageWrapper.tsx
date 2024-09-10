"use client";

import { useEffect, useMemo } from "react";

import ZkNoidGameContext from "@sdk/lib/contexts/ZkNoidGameContext";
import { useNetworkStore } from "@sdk/lib/stores/network";
import { ZkNoidConfig } from "@sdk/lib/createConfig";

export default function Page({
  gameId,
  zkNoidConfig,
}: {
  gameId: string;
  zkNoidConfig: ZkNoidConfig;
}) {
  const config = useMemo(
    () => zkNoidConfig.games.find((game) => game.id == gameId)!,
    [],
  );
  const client = useMemo(() => zkNoidConfig.getClient(), []);

  const appchainSupported = Object.keys(config.runtimeModules).length > 0;

  const networkStore = useNetworkStore();

  useEffect(() => {
    if (appchainSupported) {
      client.start().then(() => networkStore.onProtokitClientStarted());
    }
  }, [client]);

  const CompetitionsPage = config.pageCompetitionsList!;

  return (
    <ZkNoidGameContext.Provider
      value={{
        client,
        appchainSupported,
        buildLocalClient: false,
      }}
    >
      <CompetitionsPage />
    </ZkNoidGameContext.Provider>
  );
}
