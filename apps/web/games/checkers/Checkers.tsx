'use client';

import { useContext, useEffect, useState } from 'react';
import { GameView } from './components/GameView';
import { PublicKey, UInt64 } from 'o1js';
import { useNetworkStore } from '@/lib/stores/network';
import {
  useObserveCheckersMatchQueue,
  useCheckersMatchQueueStore,
} from '@/games/checkers/stores/matchQueue';
import { walletInstalled } from '@/lib/helpers';
import { useStore } from 'zustand';
import { useSessionKeyStore } from '@/lib/stores/sessionKeyStorage';
import { ClientAppChain, PENDING_BLOCKS_NUM_CONST } from 'zknoid-chain-dev';
import GamePage from '@/components/framework/GamePage';
import { checkersConfig } from './config';
import ZkNoidGameContext from '@/lib/contexts/ZkNoidGameContext';
import { useProtokitChainStore } from '@/lib/stores/protokitChain';
import { MOVE_TIMEOUT_IN_BLOCKS } from 'zknoid-chain-dev/dist/src/engine/MatchMaker';
import {
  MainButtonState,
  PvPGameView,
} from '@/components/framework/GamePage/PvPGameView';
import CheckersCoverSVG from './assets/game-cover.svg';
import CheckersCoverMobileSVG from './assets/game-cover-mobile.svg';
import { getRandomEmoji } from '@/lib/emoji';
import toast from '@/components/shared/Toast';
import { formatUnits } from '@/lib/unit';
import { Currency } from '@/constants/currency';
import { useToasterStore } from '@/lib/stores/toasterStore';
import { GameState } from './lib/gameState';
import { useStartGame } from './features/useStartGame';
import { useOnMoveChosen } from '@/games/checkers/features/useOnMoveChosen';
import {
  useLobbiesStore,
  useObserveLobbiesStore,
} from '@/lib/stores/lobbiesStore';

export default function RandzuPage({
  params,
}: {
  params: { competitionId: string };
}) {
  const [gameState, setGameState] = useState(GameState.NotStarted);
  const [loading, setLoading] = useState(true);
  const [loadingElement, setLoadingElement] = useState<
    { x: number; y: number } | undefined
  >({ x: 0, y: 0 });

  const { client } = useContext(ZkNoidGameContext);

  if (!client) {
    throw Error('Context app chain client is not set');
  }

  const networkStore = useNetworkStore();
  const matchQueue = useCheckersMatchQueueStore();
  const toasterStore = useToasterStore();
  useObserveCheckersMatchQueue();
  const protokitChain = useProtokitChainStore();
  const sessionPrivateKey = useStore(useSessionKeyStore, (state) =>
    state.getSessionKey()
  );

  const client_ = client as ClientAppChain<
    typeof checkersConfig.runtimeModules,
    any,
    any,
    any
  >;

  const query = networkStore.protokitClientStarted
    ? client_.query.runtime.CheckersLogic
    : undefined;

  useObserveLobbiesStore(query);
  const lobbiesStore = useLobbiesStore();

  console.log('Active lobby', lobbiesStore.activeLobby);

  const startGame = useStartGame(setGameState);
  const onMoveChosen = useOnMoveChosen(
    matchQueue,
    setLoading,
    setLoadingElement
  );

  const restart = () => {
    matchQueue.resetLastGameState();
    setGameState(GameState.NotStarted);
  };

  // nonSSR
  const collectPending = async () => {
    const logic = client.runtime.resolve('CheckersLogic');
    const tx = await client.transaction(
      sessionPrivateKey.toPublicKey(),
      async () => {
        logic.collectPendingBalance();
      }
    );

    console.log('Collect tx', tx);

    tx.transaction = tx.transaction?.sign(sessionPrivateKey);

    console.log('Sending tx', tx);

    await tx.send();

    console.log('Tx sent', tx);
  };

  // nonSSR
  const proveOpponentTimeout = async () => {
    const randzuLogic = client.runtime.resolve('CheckersLogic');
    const tx = await client.transaction(
      PublicKey.fromBase58(networkStore.address!),
      async () => {
        randzuLogic.proveOpponentTimeout(
          UInt64.from(matchQueue.gameInfo!.gameId)
        );
      }
    );

    await tx.sign();
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
    : (
        {
          [GameState.CurrentPlayerTurn]: MainButtonState.YourTurn,
          [GameState.OpponentTurn]: MainButtonState.OpponentsTurn,
          [GameState.OpponentTimeout]: MainButtonState.OpponentTimeOut,
          [GameState.NotStarted]: MainButtonState.NotStarted,
          [GameState.WalletNotInstalled]: MainButtonState.WalletNotInstalled,
          [GameState.WalletNotConnected]: MainButtonState.WalletNotConnected,
        } as Record<GameState, MainButtonState>
      )[gameState] || MainButtonState.None;

  const statuses = {
    [GameState.WalletNotInstalled]: 'WALLET NOT INSTALLED',
    [GameState.WalletNotConnected]: 'WALLET NOT CONNECTED',
    [GameState.NotStarted]: 'NOT STARTED',
    [GameState.MatchRegistration]: 'MATCH REGISTRATION',
    [GameState.Matchmaking]: `MATCHMAKING ${
      (protokitChain.block?.height ?? 0) % PENDING_BLOCKS_NUM_CONST
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

  useEffect(() => {
    if (gameState == GameState.Won)
      toast.success(
        toasterStore,
        `You are won! Winnings: ${formatUnits(matchQueue.pendingBalance)} ${Currency.ZNAKES}`,
        true
      );
  }, [gameState]);

  return (
    <GamePage
      gameConfig={checkersConfig}
      image={CheckersCoverSVG}
      mobileImage={CheckersCoverMobileSVG}
      defaultPage={'Game'}
    >
      <PvPGameView
        status={statuses[gameState]}
        opponent={matchQueue.gameInfo?.opponent}
        startPrice={lobbiesStore.lobbies?.[0]?.fee || 0n}
        mainButtonState={mainButtonState}
        startGame={() => startGame()}
        queueSize={matchQueue.getQueueLength()}
        gameAuthor={'zkNoid team'}
        mainText={mainText[gameState]}
        bottomButtonText={bottomButtonState[gameState]?.text}
        bottomButtonHandler={bottomButtonState[gameState]?.handler}
        competitionName={lobbiesStore.activeLobby?.name || 'Unknown'}
        gameName={'Checkers'}
        gameRules={`Checkers is a two-player game played on an 8x8 board. Players take turns moving their pieces diagonally forward, capturing opponent's pieces by jumping over them. A piece reaching the opponent's back row becomes a king and can move backward. 
        
        The game is won by capturing all of the opponent's pieces or by blocking them from moving
        `}
        competitionFunds={(lobbiesStore.activeLobby?.reward || 0n) / 2n}
      >
        <GameView
          gameInfo={matchQueue.gameInfo}
          onMoveChosen={onMoveChosen}
          loadingElement={loadingElement}
          loading={loading}
        />
      </PvPGameView>
    </GamePage>
  );
}
