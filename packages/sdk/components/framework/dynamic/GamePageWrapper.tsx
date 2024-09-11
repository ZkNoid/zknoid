"use client";

import { useEffect, useMemo } from "react";

import ZkNoidGameContext from "../../../lib/contexts/ZkNoidGameContext";
import { useNetworkStore } from "../../../lib/stores/network";
import { ZkNoidConfig } from "../../../lib/createConfig";

export default function GamePageWrapper({
  gameId,
  competitionId,
  zkNoidConfig,
}: {
  gameId: string;
  competitionId: string;
  zkNoidConfig: ZkNoidConfig;
}) {
  const config = useMemo(
    () => zkNoidConfig.games.find((game) => game.id == gameId)!,
    [],
  );
  const client = useMemo(() => zkNoidConfig.getClient(), []);
  const networkStore = useNetworkStore();
  // const logGameOpenedMutation = api.logging.logGameOpened.useMutation();
  const appchainSupported = Object.keys(config.runtimeModules).length > 0;

  useEffect(() => {
    if (appchainSupported) {
      client.start().then(() => networkStore.onProtokitClientStarted());
    }
  }, [client]);

  // useEffect(() => {
  //   if (networkStore.address) {
  //     logGameOpenedMutation.mutate({
  //       userAddress: networkStore.address,
  //       gameId,
  //       envContext: getEnvContext(),
  //     });
  //   }
  // }, [networkStore.address]);

  console.log("Providing client context", zkNoidConfig, config, client);

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
