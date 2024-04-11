import GamePage from '@/components/framework/GamePage';
import { thimblerigConfig } from '../config';
import { useNetworkStore } from '@/lib/stores/network';
import { useContext, useEffect, useState } from 'react';
import AppChainClientContext from '@/lib/contexts/AppChainClientContext';
import { getRandomEmoji } from '@/games/randzu/utils';
import {
  type ClientAppChain,
  MOVE_TIMEOUT_IN_BLOCKS,
  PENDING_BLOCKS_NUM_CONST,
} from 'zknoid-chain-dev';
import { Field, Poseidon, PublicKey, UInt64 } from 'o1js';
import { useStore } from 'zustand';
import { useSessionKeyStore } from '@/lib/stores/sessionKeyStorage';
import { walletInstalled } from '@/lib/helpers';
import {
  useObserveThimblerigMatchQueue,
  useThimblerigMatchQueueStore,
} from '../stores/matchQueue';
import { useCommitmentStore } from '@/lib/stores/commitmentStorage';
import { useProtokitChainStore } from '@/lib/stores/protokitChain';
import { DEFAULT_GAME_COST } from 'zknoid-chain-dev/dist/src/engine/MatchMaker';
import { useMinaBridge } from '@/lib/stores/protokitBalances';
import ThimbleSVG from '../assets/thimble.svg';
import ThimbleOpenedSVG from '../assets/thimble_opened_und.svg';
import ThimbleOpenedCorrectSVG from '../assets/thimble_opened_correct.svg';

import BallSVG from '../assets/ball.svg';
import ArrowSVG from '../assets/arrow.svg';
import ThimblesMixing from '../assets/thimbles_mixing.json';

import ThimblerigCoverSVG from '../assets/game-cover.svg';

import Image from 'next/image';
import Lottie from 'react-lottie';
import {
  MainButtonState,
  PvPGameView,
} from '@/components/framework/GamePage/PvPGameView';
import { api } from '@/trpc/react';
import { getEnvContext } from '@/lib/envContext';

enum GameState {
  WalletNotInstalled,
  WalletNotConnected,
  NotStarted,
  MatchRegistration,
  Matchmaking,
  OpponentTimeout,
  CurrentPlayerHiding,
  WaitingForHiding,
  CurrentPlayerGuessing,
  WaitingForGuessing,
  CurrentPlayerRevealing,
  WaitingForReveal,
  Won,
  Lost,
}

export default function Thimblerig({}: { params: { competitionId: string } }) {
  const client = useContext(AppChainClientContext) as ClientAppChain<
    typeof thimblerigConfig.runtimeModules,
    any,
    any,
    any
  >;

  const networkStore = useNetworkStore();
  const [gameState, setGameState] = useState(GameState.NotStarted);
  const [opponentTimeout, setOpponentTimeout] = useState(false);
  const [revealedValue, setRevealedValue] = useState<
    undefined | { choice: 1 | 2 | 3; value: 1 | 2 | 3 }
  >(undefined);

  const matchQueue = useThimblerigMatchQueueStore();
  const sessionPublicKey = useStore(useSessionKeyStore, (state) =>
    state.getSessionKey()
  ).toPublicKey();
  const sessionPrivateKey = useStore(useSessionKeyStore, (state) =>
    state.getSessionKey()
  );
  useObserveThimblerigMatchQueue();

  let [loading, setLoading] = useState(false);
  let [thimbleOpened, setThimbleOpened] = useState<undefined | 1 | 2 | 3>(
    undefined
  );

  let commitmentStore = useCommitmentStore();
  const protokitChain = useProtokitChainStore();

  const restart = () => {
    matchQueue.resetLastGameState();
    setRevealedValue(undefined);
    setGameState(GameState.NotStarted);
  };
  const bridge = useMinaBridge();

  const gameStartedMutation = api.logging.logGameStarted.useMutation();

  const startGame = async () => {
    if (await bridge(DEFAULT_GAME_COST.toBigInt())) return;

    gameStartedMutation.mutate({
      gameId: 'thimblerig',
      userAddress: networkStore.address ?? '',
      envContext: getEnvContext(),
    });

    const thimblerigLogic = client.runtime.resolve('ThimblerigLogic');

    const tx = await client.transaction(
      PublicKey.fromBase58(networkStore.address!),
      () => {
        thimblerigLogic.register(
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
    const randzuLogic = client.runtime.resolve('ThimblerigLogic');

    const tx = await client.transaction(sessionPrivateKey.toPublicKey(), () => {
      randzuLogic.collectPendingBalance();
    });

    console.log('Collect tx', tx);

    tx.transaction = tx.transaction?.sign(sessionPrivateKey);

    console.log('Sending tx', tx);

    await tx.send();

    console.log('Tx sent', tx);
  };

  /**
   *
   * @param id Number 1-3
   */
  const commitThumblerig = async (id: number) => {
    const salt = commitmentStore.commit(id);

    const thimblerigLogic = client.runtime.resolve('ThimblerigLogic');

    const commitment = Poseidon.hash([...UInt64.from(id).toFields(), salt]);
    const tx = await client.transaction(
      PublicKey.fromBase58(networkStore.address!),
      () => {
        thimblerigLogic.commitValue(
          UInt64.from(matchQueue.activeGameId),
          commitment
        );
      }
    );

    await tx.sign();
    await tx.send();
  };

  /**
   *
   * @param choice Number 1-3
   */
  const chooseThumblerig = async (choice: number) => {
    const thimblerigLogic = client.runtime.resolve('ThimblerigLogic');
    const tx = await client.transaction(
      PublicKey.fromBase58(networkStore.address!),
      () => {
        thimblerigLogic.chooseThumble(
          UInt64.from(matchQueue.activeGameId),
          UInt64.from(choice)
        );
      }
    );

    await tx.sign();
    await tx.send();
  };

  const revealThumblerig = async () => {
    const thimblerigLogic = client.runtime.resolve('ThimblerigLogic');
    const commitment = commitmentStore.getCommitment();

    const tx = await client.transaction(
      PublicKey.fromBase58(networkStore.address!),
      () => {
        thimblerigLogic.revealCommitment(
          UInt64.from(matchQueue.activeGameId),
          commitment.value,
          commitment.salt
        );
      }
    );

    await tx.sign();
    await tx.send();
  };

  const proveOpponentTimeout = async () => {
    const thibmerigLogic = client.runtime.resolve('ThimblerigLogic');

    const tx = await client.transaction(
      PublicKey.fromBase58(networkStore.address!),
      () => {
        thibmerigLogic.proveCommitNotRevealed(
          UInt64.from(matchQueue.gameInfo!.gameId)
        );
      }
    );

    await tx.sign();
    await tx.send();
  };

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
      console.log(matchQueue.inQueue, !matchQueue.activeGameId)
      setGameState(GameState.Matchmaking);
    } else if (
      matchQueue.gameInfo &&
      matchQueue.activeGameId &&
      !matchQueue.gameInfo?.isCurrentUserMove &&
      BigInt(protokitChain?.block?.height || '0') -
        matchQueue.gameInfo?.lastMoveBlockHeight >
        MOVE_TIMEOUT_IN_BLOCKS
    ) {
      setGameState(GameState.OpponentTimeout);
    } else if (
      matchQueue.gameInfo?.isCurrentUserMove &&
      !loading &&
      matchQueue.activeGameId &&
      !matchQueue.gameInfo.field.commitedHash.toBigInt() &&
      !matchQueue.gameInfo.field.choice.toBigInt()
    ) {
      setGameState(GameState.CurrentPlayerHiding);
    } else if (
      !matchQueue.gameInfo?.isCurrentUserMove &&
      matchQueue.activeGameId &&
      !loading &&
      !matchQueue.gameInfo?.field.commitedHash.toBigInt() &&
      !matchQueue.gameInfo?.field.choice.toBigInt()
    ) {
      setGameState(GameState.WaitingForHiding);
    } else if (
      matchQueue.gameInfo?.isCurrentUserMove &&
      !loading &&
      matchQueue.gameInfo.field.commitedHash.toBigInt() &&
      !matchQueue.gameInfo.field.choice.toBigInt()
    ) {
      setGameState(GameState.CurrentPlayerGuessing);
    } else if (
      !matchQueue.gameInfo?.isCurrentUserMove &&
      matchQueue.activeGameId &&
      !loading &&
      matchQueue.gameInfo.field.commitedHash.toBigInt() &&
      !matchQueue.gameInfo.field.choice.toBigInt()
    ) {
      setGameState(GameState.WaitingForGuessing);
    } else if (
      matchQueue.gameInfo?.isCurrentUserMove &&
      !loading &&
      matchQueue.gameInfo.field.commitedHash.toBigInt() &&
      matchQueue.gameInfo.field.choice.toBigInt()
    ) {
      setGameState(GameState.CurrentPlayerRevealing);
    } else if (
      !matchQueue.gameInfo?.isCurrentUserMove &&
      matchQueue.activeGameId &&
      !loading &&
      matchQueue.gameInfo.field.commitedHash.toBigInt() &&
      matchQueue.gameInfo.field.choice.toBigInt()
    ) {
      setGameState(GameState.WaitingForReveal);
    } else {
      if (matchQueue.lastGameState == 'win') {
        console.log(
          'Win, value:',
          Number(matchQueue.gameInfo.field.value.toBigInt())
        );
        console.log(
          'Win, salt:',
          Number(matchQueue.gameInfo.field.choice.toBigInt())
        );

        setRevealedValue({
          value: Number(matchQueue.gameInfo.field.value.toBigInt()) as
            | 1
            | 2
            | 3,
          choice: Number(matchQueue.gameInfo.field.choice.toBigInt()) as
            | 1
            | 2
            | 3,
        });
        setGameState(GameState.Won);
      } else if (matchQueue.lastGameState == 'lost') {
        console.log(
          'Lost, value:',
          Number(matchQueue.gameInfo.field.value.toBigInt())
        );
        console.log(
          'Lost, salt:',
          Number(matchQueue.gameInfo.field.choice.toBigInt())
        );

        setRevealedValue({
          value: Number(matchQueue.gameInfo.field.value.toBigInt()) as
            | 1
            | 2
            | 3,
          choice: Number(matchQueue.gameInfo.field.choice.toBigInt()) as
            | 1
            | 2
            | 3,
        });
        setGameState(GameState.Lost);
      } else {
        setGameState(GameState.NotStarted);
      }
    }
  }, [
    matchQueue.activeGameId,
    matchQueue.inQueue,
    matchQueue.lastGameState,
    matchQueue.gameInfo,
  ]);

  const statuses = {
    [GameState.WalletNotInstalled]: 'WALLET NOT INSTALLED',
    [GameState.WalletNotConnected]: 'WALLET NOT CONNECTED',
    [GameState.NotStarted]: 'NOT STARTED',
    [GameState.OpponentTimeout]: 'OPPONENT TIMEOUT',
    [GameState.MatchRegistration]: 'MATCH REGISTRATION',
    [GameState.Matchmaking]: `MATCHMAKING ${
      parseInt(protokitChain.block?.height ?? '0') % PENDING_BLOCKS_NUM_CONST
    }  / ${PENDING_BLOCKS_NUM_CONST} 🔍`,
    [GameState.CurrentPlayerHiding]: `HIDING BALL`,
    [GameState.WaitingForHiding]: `OPPONENT HIDING BALL`,
    [GameState.CurrentPlayerGuessing]: 'YOUR GUESS',
    [GameState.WaitingForGuessing]: 'OPPONENT GUESSES',
    [GameState.CurrentPlayerRevealing]: 'YOUR REVEAL',
    [GameState.WaitingForReveal]: 'OPPONENT REVEAL',
    [GameState.Won]: 'YOU WON',
    [GameState.Lost]: 'YOU LOST',
  } as Record<GameState, string>;

  const mainText = {
    [GameState.OpponentTimeout]: 'Opponent timed out. Prove to win',
    [GameState.CurrentPlayerHiding]: 'Choose thimble to hide ball behind',
    [GameState.WaitingForHiding]:
      'Your opponent hides the ball, wait for your turn',
    [GameState.CurrentPlayerGuessing]:
      'Guess under what thimble ball is hidden by opponent',
    [GameState.WaitingForGuessing]: 'Wait for opponent to guess',
    [GameState.CurrentPlayerRevealing]: 'Revealing position',
    [GameState.WaitingForReveal]:
      'Your opponent reveals position of the ball, wait for your turn',
    [GameState.Won]: `${getRandomEmoji('happy')}You won! Congratulations!`,
    [GameState.Lost]: `${getRandomEmoji('sad')} You've lost...`,
  } as Record<GameState, string>;

  const bottomButtonState = {
    [GameState.CurrentPlayerRevealing]: {
      text: 'REVEAL POSITION',
      handler: () => {
        revealThumblerig();
      },
    },
    [GameState.OpponentTimeout]: {
      text: 'PROVE OPPONENT TIMEOUT',
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

  const status = statuses[gameState] ?? 'NONE';

  const mainButtonState = [
    GameState.CurrentPlayerHiding,
    GameState.CurrentPlayerGuessing,
    GameState.CurrentPlayerRevealing,
  ].includes(gameState)
    ? MainButtonState.YourTurn
    : [
          GameState.WaitingForHiding,
          GameState.WaitingForGuessing,
          GameState.WaitingForReveal,
        ].includes(gameState)
      ? MainButtonState.OpponentsTurn
      : gameState == GameState.NotStarted
        ? MainButtonState.NotStarted
        : gameState == GameState.WalletNotInstalled
          ? MainButtonState.WalletNotInstalled
          : gameState == GameState.WalletNotConnected
            ? MainButtonState.WalletNotConnected
            : MainButtonState.None;

  console.log('Revealed value', revealedValue);

  return (
    <GamePage
      gameConfig={thimblerigConfig}
      image={ThimblerigCoverSVG}
      defaultPage={'Game'}
    >
      <PvPGameView
        status={status}
        opponent={matchQueue.gameInfo?.opponent}
        startPrice={DEFAULT_GAME_COST.toBigInt()}
        mainButtonState={mainButtonState}
        startGame={startGame}
        queueSize={matchQueue.queueLength}
        gameRating={5.0}
        gameAuthor="ZkNoid Team"
        mainText={mainText[gameState]}
        bottomButtonText={bottomButtonState[gameState]?.text}
        bottomButtonHandler={bottomButtonState[gameState]?.handler}
        competitionName="Room 1"
        gameName="Thimblerig"
        gameRules={`1. Two players participate in each round of the game. One player \
        hides a ball under one of three thimbles, and the other player \
        attempts to guess the location of the ball. \
        \n
        2. The hiding player places ball under one of three thimbles trying \
            to confuse the guessing player. \
        \n
        3. The guessing player selects one of the thimbles, trying to guess \
        which thimble conceals the ball. The hiding player then reveals \
        whether the ball is under the chosen
        `}
        competitionFunds={DEFAULT_GAME_COST.toBigInt() * 100n}
      >
        <div className="flex gap-10">
          {![GameState.WaitingForHiding, GameState.WaitingForGuessing].includes(
            gameState
          ) &&
            Array.from({ length: 3 }, (_, i) => {
              return (
                <Image
                  key={i}
                  src={
                    gameState == GameState.CurrentPlayerGuessing &&
                    thimbleOpened == i + 1
                      ? ThimbleOpenedSVG
                      : (gameState == GameState.Won ||
                            gameState == GameState.Lost) &&
                          revealedValue?.value == i + 1
                        ? ThimbleOpenedCorrectSVG
                        : (gameState == GameState.Won ||
                              gameState == GameState.Lost) &&
                            revealedValue?.choice == i + 1
                          ? ThimbleOpenedSVG
                          : ThimbleSVG
                  }
                  alt={'Thimble'}
                  draggable="true"
                  onDrop={() => {
                    gameState == GameState.CurrentPlayerHiding &&
                      commitThumblerig(i + 1);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    return false;
                  }}
                  onPointerEnter={(e) => {
                    if (gameState == GameState.CurrentPlayerGuessing)
                      setThimbleOpened((i + 1) as 1 | 2 | 3);
                    // console.log('Pointer enter', i);
                  }}
                  onPointerLeave={(e) => {
                    if (
                      thimbleOpened == i + 1 &&
                      gameState == GameState.CurrentPlayerGuessing
                    ) {
                      setThimbleOpened(undefined);
                    }
                  }}
                  onClick={() =>
                    gameState == GameState.CurrentPlayerGuessing &&
                    chooseThumblerig(i + 1)
                  }
                />
              );
            })}
          {[GameState.WaitingForHiding, GameState.WaitingForGuessing].includes(
            gameState
          ) && (
            <Lottie
              options={{
                animationData: ThimblesMixing,
                rendererSettings: {
                  className: `z-0 h-full`,
                },
              }}
              speed={0.6}
              // height={height}
              // isStopped={!visible && false}
            ></Lottie>
          )}
        </div>
        <div className="">
          {gameState == GameState.CurrentPlayerHiding && (
            <div className="flex w-1/2 flex-row items-center justify-between gap-1 py-10 font-museo text-[24px]/[24px]">
              <div className="block min-h-[56px] min-w-[56px]" draggable={true}>
                <Image src={BallSVG} alt="Ball" className="pr-2" />
              </div>

              <div
                className="font-plex text-[16px]/[16px] uppercase text-left-accent"
                draggable={true}
              >
                Drag the ball under one the thimbles and confirm your selection
              </div>
              <Image src={ArrowSVG} alt="Arrow" />
            </div>
          )}
          {gameState == GameState.CurrentPlayerGuessing && (
            <div className="flex w-1/2 flex-row items-center justify-between gap-1 py-10 font-museo text-[24px]/[24px]">
              <div
                className="font-plex text-[16px]/[16px] uppercase text-left-accent"
                draggable={true}
              >
                Select the thimble under which you think your opponent has
                hidden the ball
              </div>
              <Image src={ArrowSVG} alt="Arrow" />
            </div>
          )}
        </div>
      </PvPGameView>
    </GamePage>
  );
}
