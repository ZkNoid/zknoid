import { getEnvContext } from '@/lib/envContext';
import { useMinaBridge } from '@/lib/stores/protokitBalances';
import { api } from '@/trpc/react';
import { GameState } from '../lib/gameState';
import { ICompetition } from '@/lib/types';
import { useNetworkStore } from '@/lib/stores/network';

export const useStartGame = (
  setGameState: (state: GameState) => void,
  gameId: number,
  setGameId: (id: number) => void,
  competition: ICompetition | undefined
) => {
  let bridge = useMinaBridge();
  const networkStore = useNetworkStore();
  const gameStartedMutation = api.logging.logGameStarted.useMutation();

  return async () => {
    if (competition!.participationFee > 0) {
      if (await bridge(competition!.participationFee)) return;
    }

    gameStartedMutation.mutate({
      gameId: 'arkanoid',
      userAddress: networkStore.address ?? '',
      envContext: getEnvContext(),
    });

    setGameState(GameState.Active);
    setGameId(gameId + 1);
  };
};
