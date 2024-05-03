'use client';

import { useContext, useEffect, useRef, useState } from 'react';
import { GameView, ITick } from '@/games/arkanoid/components/GameView';
import {
  Bricks,
  GameInputs,
  Tick,
  CHUNK_LENGTH,
  createBricksBySeed,
} from 'zknoid-chain-dev';
import { Bool, Field, Int64, PublicKey, UInt64 } from 'o1js';
import { useNetworkStore } from '@/lib/stores/network';
import { useMinaBridge } from '@/lib/stores/protokitBalances';
import {
  useArkanoidLeaderboardStore,
  useObserveArkanoidLeaderboard,
} from '@/games/arkanoid/stores/arkanoidLeaderboard';
import { walletInstalled } from '@/lib/helpers';
import { ICompetition } from '@/lib/types';
import { fromContractCompetition } from '@/lib/typesConverter';
import { useWorkerClientStore } from '@/lib/stores/workerClient';
import AppChainClientContext from '@/lib/contexts/AppChainClientContext';
import GamePage from '@/components/framework/GamePage';
import { arkanoidConfig } from '../config';
import { GameWidget } from '@/components/framework/GameWidget/GameWidget';
import { Leaderboard } from '@/components/framework/GameWidget/Leaderboard';
import { Competition } from '@/components/framework/GameWidget/Competition';
import { ConnectWallet } from '@/components/framework/GameWidget/ConnectWallet';
import { RateGame } from '@/components/framework/GameWidget/RateGame';
import { Lost } from '@/components/framework/GameWidget/Lost';
import { Win } from '@/components/framework/GameWidget/Win';
import { InstallWallet } from '@/components/framework/GameWidget/InstallWallet';
import { DebugCheckbox } from '@/components/framework/GameWidget/DebugCheckbox';
import { UnsetCompetitionPopup } from '@/components/framework/GameWidget/UnsetCompetitionPopup';
import { useSwitchWidgetStorage } from '@/lib/stores/switchWidgetStorage';
import { FullscreenButton } from '@/components/framework/GameWidget/FullscreenButton';
import { api } from '@/trpc/react';
import { getEnvContext } from '@/lib/envContext';
import ArkanoidCoverSVG from '../assets/game-cover.svg';
import ArkanoidMobileCoverSVG from '../assets/game-cover-mobile.svg';
import { FullscreenWrap } from '@/components/framework/GameWidget/FullscreenWrap';
import { Button } from '@/components/ui/games-store/shared/Button';
import { Modal } from '@/components/ui/games-store/shared/Modal';
import Link from 'next/link';

enum GameState {
  NotStarted,
  Active,
  Won,
  Lost,
  Replay,
  Proofing,
  RateGame,
}

const chunkenize = (arr: any[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

export default function ArkanoidPage({
  params,
}: {
  params: { competitionId: string };
}) {
  const [gameState, setGameState] = useState(GameState.NotStarted);
  const [lastTicks, setLastTicks] = useState<ITick[]>([]);
  const [score, setScore] = useState<number>(0);
  const [ticksAmount, setTicksAmount] = useState<number>(0);
  const [competition, setCompetition] = useState<ICompetition>();

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isFullscreenLoading, setIsFullscreenLoading] =
    useState<boolean>(false);
  const [isPreRegModalOpen, setIsPreRegModalOpen] = useState<boolean>(false);

  const shouldUpdateLeaderboard = useRef(false);

  const client = useContext(AppChainClientContext);

  if (!client) {
    throw Error('Context app chain client is not set');
  }

  useObserveArkanoidLeaderboard(params.competitionId, shouldUpdateLeaderboard);

  const leaderboardStore = useArkanoidLeaderboardStore();
  const switchStore = useSwitchWidgetStorage();
  const workerClientStore = useWorkerClientStore();

  let [gameId, setGameId] = useState(0);
  let [debug, setDebug] = useState(true);

  let [level, setLevel] = useState<Bricks>(Bricks.empty);

  const networkStore = useNetworkStore();
  const gameStartedMutation = api.logging.logGameStarted.useMutation();

  const progress = api.progress.setSolvedQuests.useMutation();

  let bridge = useMinaBridge();

  const startGame = async () => {
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

  useEffect(() => {
    if (!networkStore.protokitClientStarted) return;
    getCompetition();
  }, [networkStore.protokitClientStarted]);

  useEffect(() => {
    if (gameState == GameState.Active) {
      shouldUpdateLeaderboard.current = false;
    } else {
      shouldUpdateLeaderboard.current = true;
    }
  }, [gameState]);

  const getCompetition = async () => {
    let competitionId = +params.competitionId;
    if (isNaN(competitionId)) {
      console.log(
        `Can't load level. competitionId is not a number. Loading default level`
      );
      return;
    }
    let contractCompetition =
      await client.query.runtime.ArkanoidGameHub.competitions.get(
        UInt64.from(competitionId)
      );
    if (contractCompetition === undefined) {
      console.log(`Can't get competition with id <${competitionId}>`);
      return;
    }

    let creator =
      await client.query.runtime.ArkanoidGameHub.competitionCreator.get(
        UInt64.from(competitionId)
      ) as PublicKey;

    let competition = fromContractCompetition(
      competitionId,
      contractCompetition
    );
    // @ts-ignore
    competition.creator = creator;

    let bricks = createBricksBySeed(Field.from(competition!.seed));

    setCompetition(competition);
    setLevel(bricks);
  };

  // useEffect(() => {
  //   let bricks = createBricksBySeed(Int64.from(competition!.seed));

  //   setLevel(bricks);
  // }, [competition]);

  const proof = async () => {
    console.log('Ticks', lastTicks);

    let chunks = chunkenize(
      lastTicks.map(
        (elem) =>
          // @ts-expect-error
          new Tick({
            action: Int64.from(elem.action),
            momentum: Int64.from(elem.momentum),
          })
      ),
      CHUNK_LENGTH
    );

    // @ts-expect-error
    let userInputs = chunks.map((chunk) => new GameInputs({ ticks: chunk }));

    try {
      const proof = await workerClientStore?.client?.proveGameRecord({
        seed: Field.from(competition!.seed),
        inputs: userInputs,
        debug: Bool(false),
      });

      console.log('Level proof', proof);

      const gameHub = client!.runtime.resolve('ArkanoidGameHub');

      const tx = await client!.transaction(
        PublicKey.fromBase58(networkStore.address!),
        () => {
          gameHub.addGameResult(UInt64.from(competition!.id), proof!);
        }
      );

      await tx.sign();
      await tx.send();

      if (score > 90000) {
        await progress.mutateAsync({
          userAddress: networkStore.address!,
          section: 'ARKANOID',
          roomId: competition?.id.toString(),
          id: 0,
          txHash: tx.transaction!.hash().toString(),
          envContext: getEnvContext(),
        });
      }

      if (competition?.preReg) {
        await progress.mutateAsync({
          userAddress: competition?.creator?.toBase58() || '',
          section: 'ARKANOID',
          roomId: competition?.id.toString(),
          id: 2,
          txHash: tx.transaction!.hash().toString(),
          envContext: getEnvContext(),
        });
      }

      if (competition?.creator && competition.preReg) {
        await progress.mutateAsync({
          userAddress: networkStore.address!,
          section: 'ARKANOID',
          roomId: competition?.id.toString(),
          id: 3,
          txHash: tx.transaction!.hash().toString(),
          envContext: getEnvContext(),
        });
      }

      if (score > 90000 && competition?.creator) {
        await progress.mutateAsync({
          userAddress: networkStore.address!,
          section: 'ARKANOID',
          roomId: competition?.id.toString(),
          id: 4,
          txHash: tx.transaction!.hash().toString(),
          envContext: getEnvContext(),
        });
      }
    } catch (e) {
      console.log('Error while generating ZK proof');
      console.log(e);
    }
  };

  useEffect(() => {
    if (
      competition &&
      params.competitionId != switchStore.competitionId?.toString()
    )
      switchStore.setCompetitionId(competition.id);
  }, [competition, params.competitionId, switchStore.competitionId]);

  const isRestartButton =
    gameState === GameState.Lost || gameState === GameState.Won;

  useEffect(() => {
    if (
      competition &&
      competition.competitionDate.start.getTime() > Date.now()
    ) {
      setIsPreRegModalOpen(true);
    }
  }, [competition]);

  const formatDate = (item: string | undefined) => {
    // @ts-ignore
    if (item.length < 2) return '0' + item;
    else return item;
  };
  const formatMonth = (item: number | undefined) => {
    // @ts-ignore
    item += 1;
    // @ts-ignore
    if (item.toString().length < 2) return '0' + item;
    else return item;
  };

  return (
    <GamePage
      gameConfig={arkanoidConfig}
      image={ArkanoidCoverSVG}
      mobileImage={ArkanoidMobileCoverSVG}
      defaultPage={'Game'}
    >
      <FullscreenWrap isFullscreen={isFullscreen}>
        {competition && (
          <>
            <Leaderboard
              leaderboard={leaderboardStore.getLeaderboard(
                params.competitionId
              )}
            />
            <div className={'flex flex-col gap-4 lg:hidden'}>
              <span className={'w-full text-headline-2 font-bold'}>Rules</span>
              <span className={'font-plexsans text-buttons-menu font-normal'}>
                {competition ? competition.game.rules : <> - </>}
              </span>
            </div>
          </>
        )}

        <GameWidget
          gameId={arkanoidConfig.id}
          ticks={ticksAmount}
          score={score}
          author={arkanoidConfig.author}
        >
          {networkStore.address ? (
            <>
              {!competition ? (
                <UnsetCompetitionPopup gameId={arkanoidConfig.id} />
              ) : (
                <>
                  {gameState == GameState.Won && (
                    <Win
                      onBtnClick={() => {
                        proof()
                          .then(() => setGameState(GameState.Proofing))
                          .catch((error) => {
                            console.log(error);
                          });
                      }}
                      title={'You won! Congratulations!'}
                      subTitle={
                        'If you want to see your name in leaderboard you have to send the poof! ;)'
                      }
                      btnText={'Send proof'}
                    />
                  )}
                  {gameState == GameState.Proofing && (
                    <div
                      className={
                        'flex h-full w-full flex-col items-center justify-center px-[10%] py-[15%] text-headline-1 text-left-accent lg:p-0'
                      }
                    >
                      <div
                        className={
                          'flex max-w-[60%] flex-col items-center justify-center gap-4'
                        }
                      >
                        <span className={'text-center'}>
                          Your Proof was sent - now you can see your name in
                          Leaderboard :)
                        </span>
                        <Button
                          label={'Close'}
                          onClick={() => setGameState(GameState.RateGame)}
                        />
                      </div>
                    </div>
                  )}
                  {gameState == GameState.Lost && (
                    <Lost startGame={startGame} />
                  )}
                  {gameState == GameState.RateGame && (
                    <RateGame
                      gameId={arkanoidConfig.id}
                      onClick={() => setGameState(GameState.NotStarted)}
                    />
                  )}
                  {gameState === GameState.NotStarted && (
                    <div
                      className={
                        'flex min-h-[50vh] w-full items-center justify-center lg:h-full lg:min-h-min'
                      }
                    >
                      <button
                        className={
                          'w-full max-w-[80%] rounded-[5px] border border-bg-dark bg-left-accent py-2 text-center text-[20px]/[20px] font-medium text-dark-buttons-text hover:border-left-accent hover:bg-bg-dark hover:text-left-accent lg:max-w-[40%]'
                        }
                        onClick={startGame}
                      >
                        Start game
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          ) : walletInstalled() ? (
            <ConnectWallet connectWallet={networkStore.connectWallet} />
          ) : (
            <InstallWallet />
          )}
          {gameState === GameState.Active && (
            <div
              className={
                'flex h-full w-full items-center justify-center p-[10%] lg:p-0'
              }
            >
              <GameView
                onWin={(ticks) => {
                  console.log('Ticks', ticks);
                  setLastTicks(ticks);
                  setGameState(GameState.Won);
                }}
                onLost={(ticks) => {
                  setLastTicks(ticks);
                  setGameState(GameState.Lost);
                }}
                onRestart={(ticks) => {
                  setLastTicks(ticks);
                  startGame();
                }}
                level={level}
                gameId={gameId}
                debug={debug}
                setScore={setScore}
                setTicksAmount={setTicksAmount}
              />
            </div>
          )}
          <FullscreenButton
            isFullscreen={isFullscreen}
            setIsFullscreen={setIsFullscreen}
          />
        </GameWidget>
        <span className={'block w-full text-headline-2 font-bold lg:hidden'}>
          Game
        </span>
        <Competition
          startGame={startGame}
          competition={competition}
          isRestartBtn={isRestartButton}
        />
        {isPreRegModalOpen && competition && (
          <Modal trigger={<></>} isDismissible={false} defaultOpen>
            <div
              className={
                'flex flex-col items-center justify-center gap-4 p-2 text-center lg:p-12'
              }
            >
              <span className={'text-headline-2'}>
                This competition is not active now
              </span>
              {competition.preReg ? (
                <span className={'font-plexsans text-[14px]/[14px]'}>
                  This competition in pre-registration mode, please wait until
                  the competition is started
                </span>
              ) : (
                <span className={'font-plexsans text-[14px]/[14px]'}>
                  Please wait until the competition is started
                </span>
              )}
              <span className={'my-2'}>
                Competition starts:{' '}
                {`${competition.competitionDate.start?.getFullYear().toString()}-${formatMonth(competition.competitionDate.start?.getMonth())}-${formatDate(competition.competitionDate.start?.getDate().toString())}`}
              </span>
              <Link
                className={
                  'group mt-4 flex w-full flex-row items-center justify-center gap-4 rounded-[5px] border border-bg-dark bg-middle-accent py-2 text-center text-headline-2 font-medium text-dark-buttons-text hover:border-middle-accent hover:bg-bg-dark hover:text-middle-accent'
                }
                href={`/games/${arkanoidConfig.id}/competitions-list`}
              >
                <span
                  className={
                    'text-[14px]/[14px] font-medium lg:text-buttons-menu'
                  }
                >
                  To competitions list
                </span>
              </Link>
            </div>
          </Modal>
        )}
      </FullscreenWrap>
      <DebugCheckbox debug={debug} setDebug={setDebug} />
    </GamePage>
  );
}
