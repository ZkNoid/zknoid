import GamePage from '@/components/framework/GamePage';
import { useContext, useEffect, useState } from 'react';
import ThimblerigCoverSVG from '@/games/thimblerig/assets/game-cover.svg';
import ThimblerigCoverMobileSVG from '@/games/thimblerig/assets/game-cover.svg';
import AppChainClientContext from '@/lib/contexts/AppChainClientContext';
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
  useState<boolean>(false);

  const client = useContext(AppChainClientContext) as ClientAppChain<
    typeof thimblerigConfig.runtimeModules,
    any,
    any,
    any
  >;

  if (!client) {
    throw Error('Context app chain client is not set');
  }

  return (
    <GamePage
      gameConfig={thimblerigConfig}
      image={ThimblerigCoverSVG}
      mobileImage={ThimblerigCoverMobileSVG}
      defaultPage={'Lobby list'}
    >
      {networkStore.walletConnected && networkStore.address && (
        <LobbyPage
          lobbyId={params.lobbyId}
          query={client.query.runtime.ThimblerigLogic}
          contractName={'ThimblerigLogic'}
          config={thimblerigConfig}
          rewardCoeff={1.67}
        />
      )}
    </GamePage>
  );
}
