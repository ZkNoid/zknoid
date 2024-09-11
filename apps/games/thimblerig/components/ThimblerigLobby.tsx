import { useContext } from "react";
import ThimblerigCoverSVG from "../assets/game-cover.svg";
import ThimblerigCoverMobileSVG from "../assets/game-cover.svg";
import ZkNoidGameContext from "@zknoid/sdk/lib/contexts/ZkNoidGameContext";
import { ClientAppChain } from "zknoid-chain-dev";
import { useNetworkStore } from "@zknoid/sdk/lib/stores/network";
import LobbyPage from "@zknoid/sdk/components/framework/Lobby/LobbyPage";
import { thimblerigConfig } from "../config";
import GamePage from "@zknoid/sdk/components/framework/GamePage";

export default function ThimblerigLobby({
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
    typeof thimblerigConfig.runtimeModules,
    any,
    any,
    any
  >;

  return (
    <GamePage gameConfig={thimblerigConfig} gameTitleImage={ThimblerigCoverSVG}>
      <LobbyPage
        lobbyId={params.lobbyId}
        query={
          networkStore.protokitClientStarted
            ? client_.query.runtime.ThimblerigLogic
            : undefined
        }
        contractName={"ThimblerigLogic"}
        config={thimblerigConfig}
        rewardCoeff={1.67}
      />
    </GamePage>
  );
}
