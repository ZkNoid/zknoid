import GamePage from '@/components/framework/GamePage';
import { thimblerigConfig } from '../config';
import Link from 'next/link';
import { useNetworkStore } from '@/lib/stores/network';
import { useContext, useEffect, useState } from 'react';
import AppChainClientContext from '@/lib/contexts/AppChainClientContext';
import { getRandomEmoji } from '@/games/randzu/utils';
import { useMatchQueueStore } from '@/lib/stores/matchQueue';
import {
  ClientAppChain,
  MOVE_TIMEOUT_IN_BLOCKS,
  PENDING_BLOCKS_NUM_CONST,
} from 'zknoid-chain-dev';
import { Field, Poseidon, PublicKey, UInt64 } from 'o1js';
import { useStore } from 'zustand';
import { useSessionKeyStore } from '@/lib/stores/sessionKeyStorage';
import { walletInstalled } from '@/lib/helpers';
import { useObserveThimblerigMatchQueue } from '../stores/matchQueue';
import { useCommitmentStore } from '@/lib/stores/commitmentStorage';
import { useProtokitChainStore } from '@/lib/stores/protokitChain';
import { DEFAULT_GAME_COST } from 'zknoid-chain-dev/dist/src/engine/MatchMaker';
import { useMinaBridge } from '@/lib/stores/protokitBalances';
import { formatUnits } from '@/lib/unit';
import ThimbleSVG from '../assets/thimble.svg';
import ThimbleOpenedSVG from '../assets/thimble_opened_und.svg';

import BallSVG from '../assets/ball.svg';
import ArrowSVG from '../assets/arrow.svg';
import ThimblesMixing from '../assets/thimbles_mixing.json';

import Image from 'next/image';
import { formatPubkey } from '@/lib/utils';
import Lottie from 'react-lottie';
enum GameState {
  NotStarted,
  MatchRegistration,
  Matchmaking,
  Active,
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
  const matchQueue = useMatchQueueStore();
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
    setGameState(GameState.NotStarted);
  };
  const bridge = useMinaBridge();

  const startGame = async () => {
    if (await bridge(DEFAULT_GAME_COST.toBigInt())) return;

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
   * @param id Number 0-2
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
        thibmerigLogic.proveOpponentTimeout(
          UInt64.from(matchQueue.gameInfo!.gameId)
        );
      }
    );

    await tx.sign();
    await tx.send();
  };

  const getWinnings = async () => {
    const thimblerigLogic = client.runtime.resolve('ThimblerigLogic');

    const tx = await client.transaction(
      PublicKey.fromBase58(networkStore.address!),
      () => {
        thimblerigLogic.win(UInt64.from(matchQueue.gameInfo!.gameId));
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
    if (matchQueue.inQueue && !matchQueue.activeGameId) {
      setGameState(GameState.Matchmaking);
    } else if (
      matchQueue.gameInfo?.isCurrentUserMove &&
      !loading &&
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
    } else if (matchQueue.activeGameId) {
      setGameState(GameState.Active);
    } else {
      if (matchQueue.lastGameState == 'win') setGameState(GameState.Won);
      else if (matchQueue.lastGameState == 'lost') setGameState(GameState.Lost);
      else {
        setGameState(GameState.NotStarted);
      }
    }
  }, [
    matchQueue.activeGameId,
    matchQueue.inQueue,
    matchQueue.lastGameState,
    matchQueue.gameInfo,
  ]);

  const currentUserMove =
    matchQueue.gameInfo?.isCurrentUserMove &&
    !loading &&
    !matchQueue.gameInfo.field.commitedHash.toBigInt() &&
    !matchQueue.gameInfo.field.choice.toBigInt();

  const statuses = {
    [GameState.NotStarted]: 'NOT STARTED',
    [GameState.MatchRegistration]: 'MATCH REGISTRATION',
    [GameState.Matchmaking]: `MATCHMAKING ${
      parseInt(protokitChain.block?.height ?? '0') % PENDING_BLOCKS_NUM_CONST
    }  / ${PENDING_BLOCKS_NUM_CONST} 🔍`,
    [GameState.CurrentPlayerHiding]: `HIDING BALL`,
    [GameState.WaitingForHiding]: `OPPONENT HIDING BALL`,
    [GameState.CurrentPlayerGuessing]: 'YOUR GUESS',
    [GameState.WaitingForGuessing]: 'OPPONENT GUESSES',
    [GameState.Won]: 'YOU WON',
    [GameState.Lost]: 'YOU LOST',
  } as Record<GameState, string>;

  const status = !networkStore.address
    ? 'WALLET NOT CONNECTED'
    : statuses[gameState] ?? 'NONE';

  return (
    <GamePage
      gameConfig={thimblerigConfig}
      image={'/image/game-page/game-title-template.svg'}
      defaultPage={'Game'}
    >
      <main className="flex grow flex-row items-stretch gap-5 p-5">
        <div className="flex min-h-[500px] basis-1/4 flex-col gap-2">
          <div className="font-plexsans text-[20px]/[20px] font-medium text-left-accent">
            GAME STATUS: {status}
          </div>
          <div className="flex flex-col gap-1 py-2">
            <div className="">
              Your opponent: {formatPubkey(matchQueue.gameInfo?.opponent)}{' '}
            </div>
            {[
              GameState.CurrentPlayerHiding,
              GameState.CurrentPlayerGuessing,
              GameState.CurrentPlayerRevealing,
            ].includes(gameState) && (
              <div className="flex cursor-pointer items-center justify-center rounded bg-left-accent py-2 font-plexsans text-[20px]/[20px] font-medium text-black">
                YOUR TURN
              </div>
            )}
            {[
              GameState.WaitingForHiding,
              GameState.WaitingForGuessing,
              GameState.WaitingForReveal,
            ].includes(gameState) && (
              <div className="flex cursor-pointer items-center justify-center rounded border border-white py-2 font-plexsans text-[20px]/[20px] font-medium text-white">
                OPPONENT'S TURN
              </div>
            )}
            {gameState == GameState.NotStarted && (
              <div
                className="flex cursor-pointer items-center justify-center rounded bg-left-accent py-2 font-plexsans text-[20px]/[20px] font-medium text-black"
                onClick={startGame}
              >
                START FOR 1 🪙
              </div>
            )}
          </div>
          <div className="font-plexsans text-[20px]/[20px] font-medium text-left-accent">
            PLAYERS IN QUEUE: {matchQueue.getQueueLength()}
          </div>
          <div className="flex flex-grow flex-col justify-center font-plexsans font-medium">
            <div className="flex flex-row gap-2 text-[16px]/[16px]">
              <div className="text-left-accent">GAME RATING:</div> 5.0
              <svg
                width="19"
                height="18"
                viewBox="0 0 19 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.5 0L11.6329 6.56434H18.535L12.9511 10.6213L15.084 17.1857L9.5 13.1287L3.91604 17.1857L6.04892 10.6213L0.464963 6.56434H7.36712L9.5 0Z"
                  fill="#D2FF00"
                />
              </svg>
            </div>
            <div className="flex flex-row gap-2">
              <div className="text-left-accent">AUTHOR:</div> ZkNoid Team
            </div>
          </div>
        </div>
        <div className="flex h-full flex-grow basis-1/2 flex-col items-center gap-2">
          {gameState == GameState.CurrentPlayerHiding && (
            <div className="py-10 font-museo text-[24px]/[24px]">
              Choose thimble to hide ball behind
            </div>
          )}
          {gameState == GameState.WaitingForHiding && (
            <div className="py-10 font-museo text-[24px]/[24px]">
              Your opponent hides the ball, wait for your turn
            </div>
          )}
          {gameState == GameState.CurrentPlayerGuessing && (
            <div className="py-10 font-museo text-[24px]/[24px]">
              Guess under what thimble ball is hidden by opponent
            </div>
          )}
          {gameState == GameState.WaitingForGuessing && (
            <div className="py-10 font-museo text-[24px]/[24px]">
              Wait for opponent to guess
            </div>
          )}
          {gameState == GameState.CurrentPlayerRevealing && (
            <div className="py-10 font-museo text-[24px]/[24px]">
              Revealing position
            </div>
          )}
          {gameState == GameState.WaitingForReveal && (
            <div className="py-10 font-museo text-[24px]/[24px]">
              Your opponent reveals position of the ball, wait for your turn
            </div>
          )}
          {gameState == GameState.Won && (
            <div className="py-10 font-museo text-[24px]/[24px]">
              {getRandomEmoji('happy')}You won! Congratulations!
            </div>
          )}
          {gameState == GameState.Lost && (
            <div className="py-10 font-museo text-[24px]/[24px]">
              {getRandomEmoji('sad')}You've lost...
            </div>
          )}

          <div className="flex gap-10">
            {![
              GameState.WaitingForHiding,
              GameState.WaitingForGuessing,
            ].includes(gameState) &&
              Array.from({ length: 3 }, (_, i) => {
                return (
                  <Image
                    key={i}
                    src={thimbleOpened != i + 1 ? ThimbleSVG : ThimbleOpenedSVG}
                    alt={'Thimble'}
                    draggable="true"
                    onDrop={() => {
                      commitThumblerig(i);
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
                    onClick={() => chooseThumblerig(i + 1)}
                  />
                );
              })}
            {[
              GameState.WaitingForHiding,
              GameState.WaitingForGuessing,
            ].includes(gameState) && (
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
          {gameState == GameState.CurrentPlayerRevealing && (
            <div className="w-[75%]">
              <div
                className="my-5 flex cursor-pointer items-center justify-center rounded bg-left-accent py-3 font-plexsans text-[20px]/[20px] font-medium text-black"
                onClick={() => revealThumblerig()}
              >
                REVEAL POSITION
              </div>
            </div>
          )}
          {gameState == GameState.Lost && (
            <div className="w-[75%]">
              <div
                className="my-5 flex cursor-pointer items-center justify-center rounded bg-left-accent py-3 font-plexsans text-[20px]/[20px] font-medium text-black"
                onClick={() => restart()}
              >
                RESTART
              </div>
            </div>
          )}
          {gameState == GameState.Won && (
            <div className="w-[75%]">
              <div
                className="my-5 flex cursor-pointer items-center justify-center rounded bg-left-accent py-3 font-plexsans text-[20px]/[20px] font-medium text-black"
                onClick={() => restart()}
              >
                RESTART
              </div>
            </div>
          )}
          <div className="">
            {gameState == GameState.CurrentPlayerHiding && (
              <div className="flex w-1/2 flex-row items-center justify-between gap-1 py-10 font-museo text-[24px]/[24px]">
                <div
                  className="block min-h-[56px] min-w-[56px]"
                  draggable={true}
                >
                  <Image src={BallSVG} alt="Ball" className="pr-2" />
                </div>

                <div
                  className="font-plex text-[16px]/[16px] uppercase text-left-accent"
                  draggable={true}
                >
                  Drag the ball under one the thimbles and confirm your
                  selection
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
        </div>
        <div className="flex basis-1/4 flex-col gap-2">
          <div className="py-10 font-museo text-[24px]/[24px]">Competition</div>
          <div className="flex w-[75%] flex-row justify-between font-plexsans text-[20px]/[20px] font-medium">
            <div className="text-left-accent">Name:</div>
            <div className="text-white">thimblerig</div>
          </div>
          <div className="flex w-[75%] flex-row justify-between font-plexsans text-[20px]/[20px] font-medium">
            <div className="text-left-accent">Funds:</div>
            <div className="text-white">1000 $znakes</div>
          </div>
          <div className="pt-10 font-museo text-[24px]/[24px]">
            Thimblerig rules
          </div>
          <div className="text-regular flex flex-col gap-3 py-10 font-plexsans text-[16px]">
            <div>
              1. Two players participate in each round of the game. One player
              hides a ball under one of three thimbles, and the other player
              attempts to guess the location of the ball.
            </div>
            <div>
              2. The hiding player places ball under one of three thimbles
              trying to confuse the guessing player.
            </div>
            <div>
              3. The guessing player selects one of the thimbles, trying to
              guess which thimble conceals the ball. The hiding player then
              reveals whether the ball is under the chosen
            </div>
          </div>
        </div>
      </main>
    </GamePage>
  );
}
