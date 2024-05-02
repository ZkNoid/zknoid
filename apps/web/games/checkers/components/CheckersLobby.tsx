import GamePage from '@/components/framework/GamePage';
import { useContext, useEffect, useState } from 'react';
import CheckersCoverSVG from '@/public/image/game-page/game-title-template.svg';
import CheckersCoverMobileSVG from '@/public/image/game-page/game-title-mobile-template.svg';
import AppChainClientContext from '@/lib/contexts/AppChainClientContext';
import { ClientAppChain, ProtoUInt64 } from 'zknoid-chain-dev';
import { useNetworkStore } from '@/lib/stores/network';
import LobbyPage from '@/components/framework/Lobby/LobbyPage';
import { checkersConfig } from '../config';

export default function CheckersLobby({
  params,
}: {
  params: { lobbyId: string };
}) {
  const networkStore = useNetworkStore();
  useState<boolean>(false);

  const client = useContext(AppChainClientContext) as ClientAppChain<
    typeof checkersConfig.runtimeModules,
    any,
    any,
    any
  >;

  if (!client) {
    throw Error('Context app chain client is not set');
  }

  return (
    <GamePage
      gameConfig={checkersConfig}
      image={CheckersCoverSVG}
      mobileImage={CheckersCoverMobileSVG}
      defaultPage={'Lobby list'}
    >
      {networkStore.walletConnected && networkStore.address && (
        <LobbyPage
          lobbyId={params.lobbyId}
          query={client.query.runtime.CheckersLogic}
          contractName={'CheckersLogic'}
          config={checkersConfig}
        />
      )}
    </GamePage>
  );
}
