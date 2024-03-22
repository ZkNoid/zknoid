'use client';

import { useContext, useEffect, useState } from 'react';
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
import { defaultGames } from '@/app/constants/games';
import { Currency } from '@/constants/currency';
import { UnsetCompetitionPopup } from '@/components/framework/GameWidget/UnsetCompetitionPopup';

enum GameState {
  NotStarted,
  Active,
  Won,
  Lost,
  Replay,
  Proofing,
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

  const client = useContext(AppChainClientContext);

  if (!client) {
    throw Error('Context app chain client is not set');
  }

  useObserveArkanoidLeaderboard(params.competitionId);

  const leaderboardStore = useArkanoidLeaderboardStore();
  const workerClientStore = useWorkerClientStore();

  let [gameId, setGameId] = useState(0);
  let [debug, setDebug] = useState(true);

  let [level, setLevel] = useState<Bricks>(Bricks.empty);

  const networkStore = useNetworkStore();

  let bridge = useMinaBridge();

  const startGame = async () => {
    if (competition!.participationFee > 0) {
      await bridge(competition!.participationFee);
    }

    setGameState(GameState.Active);
    setGameId(gameId + 1);
  };

  useEffect(() => {
    if (!networkStore.protokitClientStarted) return;
    getCompetition();
  }, [networkStore.protokitClientStarted]);

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

    let competition = fromContractCompetition(
      competitionId,
      contractCompetition
    );

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
    } catch (e) {
      console.log('Error while generating ZK proof');
      console.log(e);
    }
  };

  const [isConnectWallet, setIsConnectWallet] = useState<boolean>(false);
  const [isInstallWallet, setIsInstallWallet] = useState<boolean>(false);
  const [isRateGame, setIsRateGame] = useState<boolean>(false);
  const [isUnsetCompetitionPopup, setIsUnsetCompetitionPopup] =
    useState<boolean>(false);

  // TEMPORARY DATA
  const DEBUG_PLAYERS = [
    'mLZLPXq1ZSx8UQBWueT7Gcagu6ywuLoZ367g7o7bjvTUidtGz2Xi1qF',
    'Wv6Tdj1abxqQyLZF77eLoU7Pwct7uUXgG8S1umG6ZiBXz3guoTL2Zqi',
    'uUWZuigy7Q6vTXq7d1oLBm3GP1o7XcaewTGL7b8zxjiqu6ZFtU2gSZL',
    '7Q73wog6j7iuGexXZ7z8qLo1mu1ubXLSgUZGF62PLyvTtqBiaUTcdWZ',
    'gbWuq61Zuwz3y2LLGUa8d6X7uGiXvFLZgxqP7BS7Uc1oTjmiet7TZoQ',
    'gS2XxLg7a81iouPeTGzT6iomGBquU6u7LWq7ZbQFLX3cj1Udty7ZZvw',
    'PGXiXG8bUv7q7ZTLymwS161jtdLgZFcLaTuooi7Wq7QZB62uz3ueUgx',
    'U6biZcWT1LZuxqmGPFiX7doBuLjuq7oZS1Ge7gLT27vygX6tQw3Uza8',
    'TdPXeGw7QtaS3TWzLB17u2qL7qc8ZUj7ZmuogGou6LiUxvbFZy6Xig1',
    '7gj7wZmTey77uxPUdZq8X3SQcgWLLT1iF1GuL26UGovZzuqibBXoat6',
  ];
  const DEBUG_LEADERBOARD = [
    {
      score: new UInt64(100),
      player: DEBUG_PLAYERS[0],
    },
    {
      score: new UInt64(200),
      player: DEBUG_PLAYERS[1],
    },
    {
      score: new UInt64(300),
      player: DEBUG_PLAYERS[2],
    },
    {
      score: new UInt64(400),
      player: DEBUG_PLAYERS[3],
    },
    {
      score: new UInt64(500),
      player: DEBUG_PLAYERS[4],
    },
    {
      score: new UInt64(600),
      player: DEBUG_PLAYERS[5],
    },
    {
      score: new UInt64(700),
      player: DEBUG_PLAYERS[6],
    },
    {
      score: new UInt64(800),
      player: DEBUG_PLAYERS[7],
    },
    {
      score: new UInt64(900),
      player: DEBUG_PLAYERS[8],
    },
  ];

  const DEBUG_COMPETITION: ICompetition = {
    game: defaultGames[0],
    title: 'Arcanoid',
    id: 0,
    preReg: false,
    preRegDate: {
      start: new Date(2024, 2, 15),
      end: new Date(2024, 2, 20),
    },
    competitionDate: {
      start: new Date(2024, 2, 15),
      end: new Date(2024, 2, 20),
    },
    participationFee: 5n * 10n ** 9n,
    currency: Currency.MINA,
    reward: 1000n * 10n ** 9n,
    seed: 123,
    registered: false,
  };

  const isRestartButton =
    gameState === GameState.Lost || gameState === GameState.Won;

  return (
    <GamePage
      gameConfig={arkanoidConfig}
      image={'/image/game-page/arkanoid-title.svg'}
      defaultPage={'Game'}
    >
      <div className={'grid grid-cols-4 grid-rows-1 gap-4'}>
        {params.competitionId !== 'undefined' && (
          <Leaderboard leaderboard={DEBUG_LEADERBOARD} />
        )}
        <GameWidget
          ticks={ticksAmount}
          score={score}
          gameRating={arkanoidConfig.rating}
          author={arkanoidConfig.author}
        >
          {networkStore.address ? (
            <>
              {params.competitionId === 'undefined' && (
                <UnsetCompetitionPopup
                  setIsVisible={setIsUnsetCompetitionPopup}
                  gameId={arkanoidConfig.id}
                />
              )}
              {gameState == GameState.Won && <Win sendProof={proof} />}
              {gameState == GameState.Lost && <Lost startGame={startGame} />}
              {gameState === GameState.NotStarted && (
                <div
                  className={'flex h-full w-full items-center justify-center'}
                >
                  <button
                    className={
                      'w-full max-w-[40%] rounded-[5px] border border-bg-dark bg-left-accent py-2 text-center text-[20px]/[20px] font-medium text-dark-buttons-text hover:border-left-accent hover:bg-bg-dark hover:text-left-accent'
                    }
                    onClick={startGame}
                  >
                    Start game
                  </button>
                </div>
              )}
            </>
          ) : walletInstalled() ? (
            <ConnectWallet setIsVisible={setIsConnectWallet} />
          ) : (
            <InstallWallet setIsVisible={setIsInstallWallet} />
          )}
          {gameState === GameState.Active && (
            <div className={'flex h-full w-full items-center justify-center'}>
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
        </GameWidget>
        <Competition
          startGame={startGame}
          competition={DEBUG_COMPETITION}
          isUnset={params.competitionId === 'undefined'}
          isRestartBtn={isRestartButton}
          isDebugRestartBtn={debug}
        />
      </div>
      <DebugCheckbox debug={debug} setDebug={setDebug} />
    </GamePage>
  );
}
