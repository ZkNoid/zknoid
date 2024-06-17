import { api } from '@/trpc/react';
import { DEFAULT_PARTICIPATION_FEE } from 'zknoid-chain-dev/dist/src/engine/LobbyManager';
import { getEnvContext } from '@/lib/envContext';
import { PublicKey, UInt64 } from 'o1js';
import { useStore } from 'zustand';
import { useSessionKeyStore } from '@/lib/stores/sessionKeyStorage';
import { useMinaBridge } from '@/lib/stores/protokitBalances';
import { client } from 'zknoid-chain-dev';
import { useNetworkStore } from '@/lib/stores/network';
import { GameState } from '../lib/gameState';

export const useStartGame = (setGameState: (state: GameState) => void) => {
  const gameStartedMutation = api.logging.logGameStarted.useMutation();
  const sessionPublicKey = useStore(useSessionKeyStore, (state) =>
    state.getSessionKey()
  ).toPublicKey();
  const bridge = useMinaBridge();
  const networkStore = useNetworkStore();
  return async () => {
    if (await bridge(DEFAULT_PARTICIPATION_FEE.toBigInt())) return;

    gameStartedMutation.mutate({
      gameId: 'checkers',
      userAddress: networkStore.address ?? '',
      envContext: getEnvContext(),
    });

    const randzuLogic = client.runtime.resolve('CheckersLogic');

    const tx = await client.transaction(
      PublicKey.fromBase58(networkStore.address!),
      async () => {
        randzuLogic.register(
          sessionPublicKey,
          UInt64.from(Math.round(Date.now() / 1000))
        );
      }
    );

    await tx.sign();
    await tx.send();

    setGameState(GameState.MatchRegistration);
  };
};
