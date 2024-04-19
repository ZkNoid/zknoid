'use client';

import { ReactNode, useContext, useEffect, useState } from 'react';
import { GameView } from './GameView';
import { Int64, PublicKey, UInt32, UInt64 } from 'o1js';
import { useNetworkStore } from '@/lib/stores/network';
import { useMinaBridge } from '@/lib/stores/protokitBalances';
import { randzuCompetitions } from '@/app/constants/randzuCompetitions';
import {
  useObserveRandzuMatchQueue,
  useRandzuMatchQueueStore,
} from '@/games/randzu/stores/matchQueue';
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
  MOVE_TIMEOUT_IN_BLOCKS,
  DEFAULT_GAME_COST,
} from 'zknoid-chain-dev/dist/src/engine/MatchMaker';
import { MainButtonState } from '@/components/framework/GamePage/PvPGameView';
import RandzuCoverSVG from '../assets/game-cover.svg';
import RandzuCoverMobileSVG from '../assets/game-cover-mobile.svg';
import { GameWidget } from '@/components/framework/GameWidget/GameWidget';
import { motion } from 'framer-motion';
import { formatPubkey } from '@/lib/utils';
import { Button } from '@/components/ui/games-store/shared/Button';
import { Competition } from '@/components/framework/GameWidget/Competition';
import { Currency } from '@/constants/currency';
import { formatUnits } from '@/lib/unit';
import znakesImg from '@/public/image/tokens/znakes.svg';
import Image from 'next/image';
import { UnsetCompetitionPopup } from '@/components/framework/GameWidget/UnsetCompetitionPopup';
import { arkanoidConfig } from '@/games/arkanoid/config';
import { Win } from '@/components/framework/GameWidget/Win';
import { Lost } from '@/components/framework/GameWidget/Lost';
import { walletInstalled } from '@/lib/helpers';
import { ConnectWallet } from '@/components/framework/GameWidget/ConnectWallet';
import { InstallWallet } from '@/components/framework/GameWidget/InstallWallet';

enum GameState {
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

  const startGame = async () => {
    if (competition!.enteringPrice > 0) {
      if (await bridge(competition?.enteringPrice!)) return;
    }

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
    if (matchQueue.inQueue && !matchQueue.activeGameId) {
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
            : MainButtonState.None;

  const statuses = {
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

  const Wrap = ({ children }: { children: ReactNode }) => {
    return (
      <div
        className={
          'flex min-h-[75vh] w-full flex-col items-center justify-center rounded-[5px] border-2 border-foreground/50'
        }
      >
        {children}
      </div>
    );
  };

  return (
    <GamePage
      gameConfig={randzuConfig}
      image={RandzuCoverSVG}
      mobileImage={RandzuCoverMobileSVG}
      defaultPage={'Game'}
    >
      <motion.div className={'grid grid-cols-4 gap-4'} animate={'windowed'}>
        <div className={'flex h-full w-full flex-col gap-4'}>
          <div
            className={
              'flex w-full gap-2 font-plexsans text-[20px]/[20px] uppercase text-left-accent'
            }
          >
            <span>Game status:</span>
            <span>{statuses[gameState]}</span>
          </div>
          <div
            className={
              'flex w-full gap-2 font-plexsans text-[20px]/[20px] text-foreground'
            }
          >
            <span>Your opponent:</span>
            <span>{formatPubkey(matchQueue.gameInfo?.opponent)}</span>
          </div>
          {mainButtonState == MainButtonState.YourTurn && (
            <Button
              startContent={
                <svg
                  width="26"
                  height="18"
                  viewBox="0 0 26 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M1 7L10 16L25 1" stroke="#252525" strokeWidth="2" />
                </svg>
              }
              className="uppercase"
              label={'YOUR TURN'}
              isReadonly
            />
          )}
          {mainButtonState == MainButtonState.OpponentsTurn && (
            <Button
              startContent={
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.5134 10.5851L1.476 0L0.00136988 1.41421L11.0387 11.9994L0 22.5858L1.47463 24L12.5134 13.4136L22.5242 23.0143L23.9989 21.6001L13.988 11.9994L23.9975 2.39996L22.5229 0.98575L12.5134 10.5851Z"
                    fill="#252525"
                  />
                </svg>
              }
              className="uppercase"
              label={"OPPONENT'S TURN"}
              isReadonly
            />
          )}
          {mainButtonState == MainButtonState.OpponentTimeOut && (
            <Button
              className="uppercase"
              label={'OPPONENT TIMED OUT'}
              isReadonly
            />
          )}
          {mainButtonState == MainButtonState.TransactionExecution && (
            <Button
              startContent={
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M24 12C24 15.1826 22.7357 18.2348 20.4853 20.4853C18.2348 22.7357 15.1826 24 12 24C8.8174 24 5.76515 22.7357 3.51472 20.4853C1.26428 18.2348 0 15.1826 0 12C0 11.633 0.017 11.269 0.049 10.91L2.041 11.091C2.01367 11.3903 2 11.6933 2 12C2 13.9778 2.58649 15.9112 3.6853 17.5557C4.78412 19.2002 6.3459 20.4819 8.17317 21.2388C10.0004 21.9957 12.0111 22.1937 13.9509 21.8079C15.8907 21.422 17.6725 20.4696 19.0711 19.0711C20.4696 17.6725 21.422 15.8907 21.8079 13.9509C22.1937 12.0111 21.9957 10.0004 21.2388 8.17317C20.4819 6.3459 19.2002 4.78412 17.5557 3.6853C15.9112 2.58649 13.9778 2 12 2C11.6933 2 11.3903 2.01367 11.091 2.041L10.91 0.049C11.269 0.017 11.633 0 12 0C15.1815 0.00344108 18.2318 1.26883 20.4815 3.51852C22.7312 5.76821 23.9966 8.81846 24 12ZM5.663 4.263L4.395 2.717C3.78121 3.2216 3.2185 3.78531 2.715 4.4L4.262 5.665C4.68212 5.15305 5.15135 4.68348 5.663 4.263ZM9.142 2.415L8.571 0.5C7.80965 0.726352 7.0727 1.02783 6.371 1.4L7.31 3.166C7.89418 2.85539 8.50789 2.60381 9.142 2.415ZM3.164 7.315L1.4 6.375C1.02801 7.07678 0.726533 7.81372 0.5 8.575L2.417 9.146C2.60454 8.51172 2.85478 7.89769 3.164 7.313V7.315ZM11 6V10.277C10.7004 10.4513 10.4513 10.7004 10.277 11H7V13H10.277C10.4297 13.2652 10.6414 13.4917 10.8958 13.662C11.1501 13.8323 11.4402 13.9417 11.7436 13.9818C12.047 14.0219 12.3556 13.9917 12.6454 13.8934C12.9353 13.7951 13.1986 13.6314 13.415 13.415C13.6314 13.1986 13.7951 12.9353 13.8934 12.6454C13.9917 12.3556 14.0219 12.047 13.9818 11.7436C13.9417 11.4402 13.8323 11.1501 13.662 10.8958C13.4917 10.6414 13.2652 10.4297 13 10.277V6H11Z"
                    fill="#252525"
                  />
                </svg>
              }
              className="uppercase"
              label={'TRANSACTION EXECUTION'}
              isReadonly
            />
          )}
        </div>
        <GameWidget
          gameRating={randzuConfig.rating}
          author={randzuConfig.author}
          isPvp
          playersCount={matchQueue.getQueueLength()}
        >
          {networkStore.address ? (
            <>
              {!competition ? (
                <Wrap>
                  <UnsetCompetitionPopup gameId={arkanoidConfig.id} />
                </Wrap>
              ) : (
                <>
                  {gameState == GameState.Won && (
                    <Wrap>
                      <Win
                        onBtnClick={restart}
                        title={'You won! Congratulations!'}
                        btnText={'Find new game'}
                      />
                    </Wrap>
                  )}
                  {gameState == GameState.Lost && (
                    <Wrap>
                      <Lost startGame={restart} />
                    </Wrap>
                  )}
                  {gameState === GameState.NotStarted && (
                    <Wrap>
                      <Button
                        label={`START FOR ${formatUnits(
                          DEFAULT_GAME_COST.toBigInt()
                        )}`}
                        onClick={startGame}
                        className={'max-w-[40%]'}
                        endContent={
                          <Image
                            src={znakesImg}
                            alt={'Znakes token'}
                            className={'h-[24px] w-[24px] pb-0.5'}
                          />
                        }
                      />
                    </Wrap>
                  )}
                  {gameState === GameState.OpponentTimeout && (
                    <Wrap>
                      <div className={'flex max-w-[60%] flex-col gap-6'}>
                        <span>Opponent timeout :(</span>
                        <Button
                          label={'Restart game'}
                          onClick={() => restart()}
                        />
                      </div>
                    </Wrap>
                  )}
                </>
              )}
            </>
          ) : walletInstalled() ? (
            <Wrap>
              <ConnectWallet connectWallet={networkStore.connectWallet} />
            </Wrap>
          ) : (
            <Wrap>
              <InstallWallet />
            </Wrap>
          )}
          {(gameState === GameState.Matchmaking ||
            gameState === GameState.MatchRegistration ||
            gameState === GameState.CurrentPlayerTurn ||
            gameState === GameState.OpponentTurn) && (
            <GameView
              gameInfo={matchQueue.gameInfo}
              onCellClicked={onCellClicked}
              loadingElement={loadingElement}
              loading={loading}
            />
          )}
        </GameWidget>
        <Competition
          isPvp
          startGame={restart}
          isRestartBtn={
            gameState === GameState.Lost || gameState === GameState.Won
          }
          competition={
            competition && {
              id: Number(competition?.id),
              game: {
                id: randzuConfig.id,
                name: randzuConfig.name,
                rules: randzuConfig.rules,
                rating: randzuConfig.rating,
                author: randzuConfig.author,
              },
              title: competition.name,
              reward: competition.prizeFund,
              currency: Currency.MINA,
              startPrice: DEFAULT_GAME_COST.toBigInt(),
            }
          }
        />
      </motion.div>
      {/*<PvPGameView*/}
      {/*  status={statuses[gameState]}*/}
      {/*  opponent={matchQueue.gameInfo?.opponent}*/}
      {/*  startPrice={DEFAULT_GAME_COST.toBigInt()}*/}
      {/*  mainButtonState={mainButtonState}*/}
      {/*  startGame={() => startGame()}*/}
      {/*  queueSize={matchQueue.getQueueLength()}*/}
      {/*  gameRating={4.8}*/}
      {/*  gameAuthor={'zkNoid team'}*/}
      {/*  mainText={mainText[gameState]}*/}
      {/*  bottomButtonText={bottomButtonState[gameState]?.text}*/}
      {/*  bottomButtonHandler={bottomButtonState[gameState]?.handler}*/}
      {/*  competitionName={'Room 1'}*/}
      {/*  gameName={'Randzu'}*/}
      {/*  gameRules={`Randzu is a game played on a 15x15 grid, similar to tic-tac-toe. Two players take turns placing their mark, using balls of different colors. The goal is to get five of your marks in a row, either horizontally, vertically or diagonally.*/}

      {/*  The game continues until one player achieves the winning pattern or until the entire grid is filled without a winner, resulting in a draw.*/}
      {/*  `}*/}
      {/*  competitionFunds={DEFAULT_GAME_COST.toBigInt() * 2n}*/}
      {/*>*/}
      {/*  <GameView*/}
      {/*    gameInfo={matchQueue.gameInfo}*/}
      {/*    onCellClicked={onCellClicked}*/}
      {/*    loadingElement={loadingElement}*/}
      {/*    loading={loading}*/}
      {/*  />*/}
      {/*</PvPGameView>*/}
    </GamePage>
  );
}
