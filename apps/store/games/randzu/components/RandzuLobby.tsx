import GamePage from '@sdk/components/framework/GamePage';
import { randzuConfig } from '../config';
import RandzuCoverSVG from './assets/game-cover.svg';
import RandzuCoverMobileSVG from './assets/game-cover-mobile.svg';
import { useContext, useState } from 'react';
import ZkNoidGameContext from '@sdk/lib/contexts/ZkNoidGameContext';
import { ClientAppChain, ProtoUInt64 } from 'zknoid-chain-dev';
import { useNetworkStore } from '@sdk/lib/stores/network';
import LobbyPage from '@sdk/components/framework/Lobby/LobbyPage';

export default function RandzuLobby({
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
    typeof randzuConfig.runtimeModules,
    any,
    any,
    any
  >;

  return (
    <GamePage
      gameConfig={randzuConfig}
      image={RandzuCoverSVG}
      mobileImage={RandzuCoverMobileSVG}
      defaultPage={'Lobby list'}
    >
      <LobbyPage
        lobbyId={params.lobbyId}
        query={
          networkStore.protokitClientStarted
            ? client_.query.runtime.RandzuLogic
            : undefined
        }
        contractName={'RandzuLogic'}
        config={randzuConfig}
      />
    </GamePage>
  );
}
