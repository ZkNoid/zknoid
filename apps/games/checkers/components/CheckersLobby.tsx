import { useContext } from "react";
import CheckersCoverSVG from "../assets/game-cover.svg";
import CheckersCoverMobileSVG from "../assets/game-cover-mobile.svg";
import ZkNoidGameContext from "@sdk/lib/contexts/ZkNoidGameContext";
import { ClientAppChain } from "zknoid-chain-dev";
import LobbyPage from "@sdk/components/framework/Lobby/LobbyPage";
import { checkersConfig } from "../config";
import { useNetworkStore } from "@sdk/lib/stores/network";
import GamePage from "@sdk/components/framework/GamePage";

export default function CheckersLobby({
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
    typeof checkersConfig.runtimeModules,
    any,
    any,
    any
  >;

  return (
    <GamePage gameConfig={checkersConfig} gameTitleImage={CheckersCoverSVG}>
      <LobbyPage
        lobbyId={params.lobbyId}
        query={
          networkStore.protokitClientStarted
            ? client_.query.runtime.CheckersLogic
            : undefined
        }
        contractName={"CheckersLogic"}
        config={checkersConfig}
      />
    </GamePage>
  );
}
