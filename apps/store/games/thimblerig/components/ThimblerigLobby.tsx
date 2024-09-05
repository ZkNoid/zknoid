import GamePage from '@/components/framework/GamePage';
import { useContext, useState } from 'react';
import ThimblerigCoverSVG from '@/games/thimblerig/assets/game-cover.svg';
import ThimblerigCoverMobileSVG from '@/games/thimblerig/assets/game-cover.svg';
import ZkNoidGameContext from '@/lib/contexts/ZkNoidGameContext';
import { ClientAppChain, ProtoUInt64 } from 'zknoid-chain-dev';
import { useNetworkStore } from '@/lib/stores/network';
import LobbyPage from '@/components/framework/Lobby/LobbyPage';
import { thimblerigConfig } from '../config';

export default function ThimblerigLobby({
  params,
}: {
  params: { lobbyId: string };
}) {
  const networkStore = useNetworkStore();

  const { client } = useContext(ZkNoidGameContext);

  if (!client) {
    throw Error('Context app chain client is not set');
  }

  const client_ = client as ClientAppChain<
    typeof thimblerigConfig.runtimeModules,
    any,
    any,
    any
  >;

  return (
    <GamePage
      gameConfig={thimblerigConfig}
      image={ThimblerigCoverSVG}
      mobileImage={ThimblerigCoverMobileSVG}
      defaultPage={'Lobby list'}
    >
      <LobbyPage
        lobbyId={params.lobbyId}
        query={
          networkStore.protokitClientStarted
            ? client_.query.runtime.ThimblerigLogic
            : undefined
        }
        contractName={'ThimblerigLogic'}
        config={thimblerigConfig}
        rewardCoeff={1.67}
      />
    </GamePage>
  );
}
