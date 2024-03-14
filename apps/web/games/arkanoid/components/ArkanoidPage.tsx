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
import Link from 'next/link';
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
import { formatDecimals } from '@/lib/utils';

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
          gameHub.addGameResult(
            UInt64.from(competition!.competitionId),
            proof!
          );
        }
      );

      await tx.sign();
      await tx.send();
    } catch (e) {
      console.log('Error while generating ZK proof');
      console.log(e);
    }
  };

  return (
    <GamePage gameConfig={arkanoidConfig}>
      <main className="flex grow flex-col items-center gap-5 p-5">
        {networkStore.address ? (
          <div className="flex flex-col gap-5">
            {gameState == GameState.Won && (
              <div>
                You won! Ticks verification:{' '}
                <input
                  className="border-2 border-left-accent bg-bg-dark text-white"
                  type="text"
                  value={JSON.stringify(lastTicks)}
                  readOnly
                ></input>
              </div>
            )}
            {gameState == GameState.Lost && (
              <div>You&apos;ve lost! Nothing to prove</div>
            )}

            <div className="flex flex-row items-center justify-center gap-5">
              {(gameState == GameState.Won || gameState == GameState.Lost) && (
                <div
                  className="rounded-xl border-2 border-left-accent bg-bg-dark p-5 hover:bg-left-accent hover:text-bg-dark"
                  onClick={() => startGame()}
                >
                  Restart
                </div>
              )}
              {gameState == GameState.NotStarted && (
                <div
                  className="rounded-xl border-2 border-left-accent bg-bg-dark p-5 hover:bg-left-accent hover:text-bg-dark"
                  onClick={() => startGame()}
                >
                  Start for{' '}
                  {competition && formatDecimals(competition.participationFee)}{' '}
                  🪙
                </div>
              )}
              {gameState == GameState.Won && (
                <div
                  className="rounded-xl border-2 border-left-accent bg-bg-dark p-5 hover:bg-left-accent hover:text-bg-dark"
                  onClick={() => proof()}
                >
                  Send proof
                </div>
              )}
            </div>
          </div>
        ) : walletInstalled() ? (
          <div
            className="rounded-xl border-2 border-left-accent bg-bg-dark p-5 hover:bg-left-accent hover:text-bg-dark"
            onClick={async () => networkStore.connectWallet()}
          >
            Connect wallet
          </div>
        ) : (
          <Link
            href="https://www.aurowallet.com/"
            className="rounded-xl border-2 border-left-accent bg-bg-dark p-5 hover:bg-left-accent hover:text-bg-dark"
            rel="noopener noreferrer"
            target="_blank"
          >
            Install wallet
          </Link>
        )}
        <div className="flex w-full">
          <div className="w-1/3"></div>
          <div className="flex w-1/3 items-center justify-center">
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
          <div className="flex flex-col items-center">
            <h1> Leaderboard </h1>
            <table className="min-w-max text-left">
              <thead className="font-semibold">
                <tr>
                  <th className="w-96 border-2 border-left-accent bg-bg-dark px-6 py-3">
                    {' '}
                    Address{' '}
                  </th>
                  <th className="w-20  border-2 border-left-accent bg-bg-dark px-6 py-3">
                    {' '}
                    Score{' '}
                  </th>
                  <th> </th>
                </tr>
              </thead>
              <tbody>
                {leaderboardStore
                  .getLeaderboard(params.competitionId)
                  .map((user, i) => (
                    <tr className="border-b bg-white" key={i}>
                      <td className="border-2 border-left-accent bg-bg-dark">
                        {user.player.toBase58()}
                      </td>
                      <td className="border-2 border-left-accent bg-bg-dark">
                        {user.score.toString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          Score: {score} Ticks: {ticksAmount}
        </div>
        <div className="grow"></div>
        {/* <div className="flex flex-col gap-10">
          <div>
            Active competitions:
            <div className="flex flex-col">
              {arkanoidCompetitions.map((competition) => (
                <Link
                  href={`/games/arkanoid/${competition.id}`}
                  key={competition.id}
                >
                  {competition.name} – {competition.prizeFund} 🪙
                </Link>
              ))}
            </div>
          </div>
        </div> */}
        <div className="w-full text-end">
          Debug:{' '}
          <input
            type="checkbox"
            checked={debug}
            onChange={(event) => {
              setDebug(event.target.checked);
            }}
          ></input>
        </div>
      </main>
    </GamePage>
  );
}
