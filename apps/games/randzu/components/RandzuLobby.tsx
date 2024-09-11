import { randzuConfig } from "../config";
import RandzuCoverSVG from "../assets/game-cover.svg";
import RandzuCoverMobileSVG from "../assets/game-cover-mobile.svg";
import { useContext } from "react";
import ZkNoidGameContext from "@zknoid/sdk/lib/contexts/ZkNoidGameContext";
import { ClientAppChain } from "zknoid-chain-dev";
import { useNetworkStore } from "@zknoid/sdk/lib/stores/network";
import LobbyPage from "@zknoid/sdk/components/framework/Lobby/LobbyPage";
import GamePage from "@zknoid/sdk/components/framework/GamePage";

export default function RandzuLobby({
  params,
}: {
  params: { lobbyId: string };
}) {
  const networkStore = useNetworkStore();

  const { client } = useContext(ZkNoidGameContext);

  if (!client) {
    throw Error("Context app chain client is not set");
  }

  const client_ = client as ClientAppChain<
    typeof randzuConfig.runtimeModules,
    any,
    any,
    any
  >;

  return (
    <GamePage gameConfig={randzuConfig} gameTitleImage={RandzuCoverSVG}>
      <LobbyPage
        lobbyId={params.lobbyId}
        query={
          networkStore.protokitClientStarted
            ? client_.query.runtime.RandzuLogic
            : undefined
        }
        contractName={"RandzuLogic"}
        config={randzuConfig}
      />
    </GamePage>
  );
}
