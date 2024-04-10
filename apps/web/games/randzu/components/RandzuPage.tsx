'use client';

import { useContext, useEffect, useState } from 'react';
import { GameView } from './GameView';
import { Int64, PublicKey, UInt32, UInt64 } from 'o1js';
import { useNetworkStore } from '@/lib/stores/network';
import { useMinaBridge } from '@/lib/stores/protokitBalances';
import { randzuCompetitions } from '@/app/constants/randzuCompetitions';
import {
  useObserveRandzuMatchQueue,
  useRandzuMatchQueueStore,
} from '@/games/randzu/stores/matchQueue';
import { walletInstalled } from '@/lib/helpers';
import { useStore } from 'zustand';
import { useSessionKeyStore } from '@/lib/stores/sessionKeyStorage';
import {
  ClientAppChain,
  PENDING_BLOCKS_NUM_CONST,
  RandzuField,
  WinWitness,
} from 'zknoid-chain-dev';
import GamePage from '@/components/framework/GamePage';
import { randzuConfig } from '../config';
import AppChainClientContext from '@/lib/contexts/AppChainClientContext';
import { getRandomEmoji } from '../utils';
import { useProtokitChainStore } from '@/lib/stores/protokitChain';
import {
  DEFAULT_GAME_COST,
  MOVE_TIMEOUT_IN_BLOCKS,
} from 'zknoid-chain-dev/dist/src/engine/MatchMaker';
import { formatUnits } from '@/lib/unit';
import {
  MainButtonState,
  PvPGameView,
} from '@/components/framework/GamePage/PvPGameView';
import RandzuCoverSVG from '../assets/game-cover.svg';
import { api } from '@/trpc/react';
import { getEnvContext } from '@/lib/envContext';

enum GameState {
  WalletNotInstalled,
  WalletNotConnected,
  NotStarted,
  MatchRegistration,
  Matchmaking,
  CurrentPlayerTurn,
  OpponentTurn,
  OpponentTimeout,
  Won,
  Lost,
}

export default function RandzuPage({
  params,
}: {
  params: { competitionId: string };
}) {
  const [gameState, setGameState] = useState(GameState.NotStarted);
  const competition = randzuCompetitions.find(
    (x) => x.id == params.competitionId
  );

  const client = useContext(AppChainClientContext) as ClientAppChain<
    typeof randzuConfig.runtimeModules,
    any,
    any,
    any
  >;

  if (!client) {
    throw Error('Context app chain client is not set');
  }

  let [loading, setLoading] = useState(true);
  let [loadingElement, setLoadingElement] = useState<
    { x: number; y: number } | undefined
  >({ x: 0, y: 0 });

  const networkStore = useNetworkStore();
  const matchQueue = useRandzuMatchQueueStore();
  const sessionPublicKey = useStore(useSessionKeyStore, (state) =>
    state.getSessionKey()
  ).toPublicKey();
  const sessionPrivateKey = useStore(useSessionKeyStore, (state) =>
    state.getSessionKey()
  );

  useObserveRandzuMatchQueue();
  const protokitChain = useProtokitChainStore();

  const bridge = useMinaBridge();

  const restart = () => {
    matchQueue.resetLastGameState();
    setGameState(GameState.NotStarted);
  };

  const gameStartedMutation = api.logging.logGameStarted.useMutation();

  const startGame = async () => {
    if (await bridge(DEFAULT_GAME_COST.toBigInt())) return;

    gameStartedMutation.mutate({
      gameId: 'randzu',
      userAddress: networkStore.address ?? '',
      envContext: getEnvContext(),
    });

    const randzuLogic = client.runtime.resolve('RandzuLogic');

    const tx = await client.transaction(
      PublicKey.fromBase58(networkStore.address!),
      () => {
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

  const collectPending = async () => {
    const randzuLogic = client.runtime.resolve('RandzuLogic');

    const tx = await client.transaction(sessionPrivateKey.toPublicKey(), () => {
      randzuLogic.collectPendingBalance();
    });

    console.log('Collect tx', tx);

    tx.transaction = tx.transaction?.sign(sessionPrivateKey);

    console.log('Sending tx', tx);

    await tx.send();

    console.log('Tx sent', tx);
  };

  const proveOpponentTimeout = async () => {
    const randzuLogic = client.runtime.resolve('RandzuLogic');

    const tx = await client.transaction(
      PublicKey.fromBase58(networkStore.address!),
      () => {
        randzuLogic.proveOpponentTimeout(
          UInt64.from(matchQueue.gameInfo!.gameId)
        );
      }
    );

    await tx.sign();
    await tx.send();
  };

  const onCellClicked = async (x: number, y: number) => {
    if (!matchQueue.gameInfo?.isCurrentUserMove) return;
    if (matchQueue.gameInfo.field.value[y][x] != 0) return;
    console.log('After checks');

    const currentUserId = matchQueue.gameInfo.currentUserIndex + 1;

    const updatedField = (matchQueue.gameInfo.field as RandzuField).value.map(
      (x: UInt32[]) => x.map((x) => x.toBigint())
    );

    updatedField[y][x] = matchQueue.gameInfo.currentUserIndex + 1;
    // updatedField[x][y] = matchQueue.gameInfo.currentUserIndex + 1;

    const randzuLogic = client.runtime.resolve('RandzuLogic');

    const updatedRandzuField = RandzuField.from(updatedField);

    const winWitness1 = updatedRandzuField.checkWin(currentUserId);

    const tx = await client.transaction(sessionPrivateKey.toPublicKey(), () => {
      randzuLogic.makeMove(
        UInt64.from(matchQueue.gameInfo!.gameId),
        updatedRandzuField,
        winWitness1 ??
          new WinWitness(
            // @ts-ignore
            {
              x: UInt32.from(0),
              y: UInt32.from(0),
              directionX: Int64.from(0),
              directionY: Int64.from(0),
            }
          )
      );
    });

    setLoading(true);
    setLoadingElement({
      x,
      y,
    });

    tx.transaction = tx.transaction?.sign(sessionPrivateKey);
    await tx.send();
  };

  useEffect(() => {
    setLoading(false);
    setLoadingElement(undefined);
  }, [matchQueue.gameInfo?.isCurrentUserMove]);

  useEffect(() => {
    if (matchQueue.pendingBalance && !matchQueue.inQueue) {
      console.log('Collecting pending balance', matchQueue.pendingBalance);
      collectPending();
    }
    if (!walletInstalled()) {
      setGameState(GameState.WalletNotInstalled);
    } else if (!networkStore.address) {
      setGameState(GameState.WalletNotConnected);
    } else if (matchQueue.inQueue && !matchQueue.activeGameId) {
      setGameState(GameState.Matchmaking);
    } else if (
      matchQueue.activeGameId &&
      matchQueue.gameInfo?.isCurrentUserMove
    ) {
      setGameState(GameState.CurrentPlayerTurn);
    } else if (
      matchQueue.gameInfo &&
      !matchQueue.gameInfo?.isCurrentUserMove &&
      BigInt(protokitChain?.block?.height || '0') -
        matchQueue.gameInfo?.lastMoveBlockHeight >
        MOVE_TIMEOUT_IN_BLOCKS
    ) {
      setGameState(GameState.OpponentTimeout);
    } else if (
      matchQueue.activeGameId &&
      !matchQueue.gameInfo?.isCurrentUserMove
    ) {
      setGameState(GameState.OpponentTurn);
    } else {
      if (matchQueue.lastGameState == 'win') setGameState(GameState.Won);
      else if (matchQueue.lastGameState == 'lost') setGameState(GameState.Lost);
      else setGameState(GameState.NotStarted);
    }
  }, [
    matchQueue.activeGameId,
    matchQueue.gameInfo,
    matchQueue.inQueue,
    matchQueue.lastGameState,
    networkStore.address,
  ]);

  const mainButtonState = loading
    ? MainButtonState.TransactionExecution
    : GameState.CurrentPlayerTurn == gameState
      ? MainButtonState.YourTurn
      : GameState.OpponentTurn == gameState
        ? MainButtonState.OpponentsTurn
        : GameState.OpponentTimeout == gameState
          ? MainButtonState.OpponentTimeOut
          : gameState == GameState.NotStarted
            ? MainButtonState.NotStarted
            : gameState == GameState.WalletNotInstalled
              ? MainButtonState.WalletNotInstalled
              : gameState == GameState.WalletNotConnected
                ? MainButtonState.WalletNotConnected
                : MainButtonState.None;

  const statuses = {
    [GameState.WalletNotInstalled]: 'WALLET NOT INSTALLED',
    [GameState.WalletNotConnected]: 'WALLET NOT CONNECTED',
    [GameState.NotStarted]: 'NOT STARTED',
    [GameState.MatchRegistration]: 'MATCH REGISTRATION',
    [GameState.Matchmaking]: `MATCHMAKING ${
      parseInt(protokitChain.block?.height ?? '0') % PENDING_BLOCKS_NUM_CONST
    }  / ${PENDING_BLOCKS_NUM_CONST} 🔍`,
    [GameState.CurrentPlayerTurn]: `YOUR TURN`,
    [GameState.OpponentTurn]: `OPPONENT TURN`,
    [GameState.OpponentTimeout]: `OPPONENT TIMEOUT ${
      Number(protokitChain?.block?.height) -
      Number(matchQueue.gameInfo?.lastMoveBlockHeight)
    }`,
    [GameState.Won]: 'YOU WON',
    [GameState.Lost]: 'YOU LOST',
  } as Record<GameState, string>;

  const bottomButtonState = {
    [GameState.OpponentTimeout]: {
      text: "PROVE OPPONENT'S TIMEOUT",
      handler: () => {
        proveOpponentTimeout();
      },
    },
    [GameState.Lost]: {
      text: 'RESTART',
      handler: () => {
        restart();
      },
    },
    [GameState.Won]: {
      text: 'RESTART',
      handler: () => {
        restart();
      },
    },
  } as Record<GameState, { text: string; handler: () => void }>;

  const mainText = {
    [GameState.CurrentPlayerTurn]: 'Make your move',
    [GameState.OpponentTimeout]: 'Opponent timed out. Prove it to get turn',
    [GameState.OpponentTurn]: 'Wait for opponent to make a turn',
    [GameState.Won]: `${getRandomEmoji('happy')}You won! Congratulations!`,
    [GameState.Lost]: `${getRandomEmoji('sad')} You've lost...`,
  } as Record<GameState, string>;

  return (
    <GamePage
      gameConfig={randzuConfig}
      image={RandzuCoverSVG}
      defaultPage={'Game'}
    >
      <PvPGameView
        status={statuses[gameState]}
        opponent={matchQueue.gameInfo?.opponent}
        startPrice={DEFAULT_GAME_COST.toBigInt()}
        mainButtonState={mainButtonState}
        startGame={() => startGame()}
        queueSize={matchQueue.getQueueLength()}
        gameRating={4.8}
        gameAuthor={'zkNoid team'}
        mainText={mainText[gameState]}
        bottomButtonText={bottomButtonState[gameState]?.text}
        bottomButtonHandler={bottomButtonState[gameState]?.handler}
        competitionName={'Room 1'}
        gameName={'Randzu'}
        gameRules={`Randzu is a game played on a 15x15 grid, similar to tic-tac-toe. Two players take turns placing their mark, using balls of different colors. The goal is to get five of your marks in a row, either horizontally, vertically or diagonally.

        The game continues until one player achieves the winning pattern or until the entire grid is filled without a winner, resulting in a draw.
        `}
        competitionFunds={DEFAULT_GAME_COST.toBigInt() * 2n}
      >
        <GameView
          gameInfo={matchQueue.gameInfo}
          onCellClicked={onCellClicked}
          loadingElement={loadingElement}
          loading={loading}
        />
      </PvPGameView>
    </GamePage>
  );
}
