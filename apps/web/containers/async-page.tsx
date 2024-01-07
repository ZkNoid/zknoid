'use client';

import { useEffect, useMemo, useState } from 'react';
import { GameView } from '@/components/GameView';
import {
  Bricks,
  GameInputs,
  Tick,
  loadGameContext,
  defaultLevel,
  client,
  CHUNK_LENGTH,
} from 'zknoid-chain-dev';
import { Bool, Int64, PublicKey, Mina, AccountUpdate, JsonProof } from 'o1js';
import Link from 'next/link';
import { checkGameRecord } from 'zknoid-chain-dev';
import { GameRecord } from 'zknoid-chain-dev/dist/GameHub';
import ZknoidWorkerClient from '@/worker/zknoidWorkerClient';
import { useNetworkStore } from '@/lib/stores/network';
import { arkanoidCompetitions } from '@/app/constants/akanoidCompetitions';
import { useMinaBridge } from '@/lib/stores/protokitBalances';
enum GameState {
  NotStarted,
  Active,
  Won,
  Lost,
  Replay,
  Proofing,
}

interface UserTop {
  address: `0x${string}`;
  score: number;
}

interface ActiveCompetition {
  name: string;
  address: `0x${string}` | string | undefined;
  fund: number;
}

const chunkenize = (arr: any[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size),
  );

export default function Home({
  params,
}: {
  params: { competitionId: string };
}) {
  const [gameState, setGameState] = useState(GameState.NotStarted);
  const [lastTicks, setLastTicks] = useState<number[]>([]);
  const [score, setScore] = useState<number>(0);
  const [ticksAmount, setTicksAmount] = useState<number>(0);
  const competition = arkanoidCompetitions.find(x => x.id == params.competitionId);

  const [topUsers, setTopUsers] = useState<UserTop[]>([
    {
      address: '0x2836eC28C32E232280F984d3980BA4e05d6BF68f',
      score: 100,
    },
    {
      address: '0xE314CE1514B21f4dc39C546b3c3bca317652d0Ac',
      score: 70,
    },
  ]);

  let [gameId, setGameId] = useState(0);
  let [debug, setDebug] = useState(true);
  const level: Bricks = useMemo(() => defaultLevel(), []);
  const [workerClient, setWorkerClient] = useState<ZknoidWorkerClient | null>(
    null,
  );
  const networkStore = useNetworkStore();

  const bridge = useMinaBridge(competition?.enteringPrice! * 10 ** 9);

  const startGame = async () => {
    if (competition!.enteringPrice > 0) {
      await bridge();
    }

    setGameState(GameState.Active);
    setGameId(gameId + 1);
  };

  useEffect(() => {
    async function timeout(seconds: number): Promise<void> {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, seconds * 1000);
      });
    }

    (async () => {
      console.log('Loading web worker...');
      const zkappWorkerClient = new ZknoidWorkerClient();
      await timeout(5);

      console.log('Done loading web worker');
      console.log('Loading contracts in web worker');

      await zkappWorkerClient.loadContracts();

      console.log('Compiling contracts in web worker');

      // @todo wait for protokit support for 0.15.x
      // await zkappWorkerClient.compileContracts();

      // console.log('Contracts compilation finished');

      // await zkappWorkerClient.initZkappInstance("B62qr9UxamCE5PaEZCZnKsb6jX85W1JVCYpdB8CFE7rNZzSvusaW7sb");

      // console.log('Contracts initialization finished');

      setWorkerClient(zkappWorkerClient);
    })();
  }, []);

  const proof = async () => {
    console.log('Ticks', lastTicks);

    let chunks = chunkenize(
      // @ts-expect-error
      lastTicks.map((elem) => new Tick({ action: Int64.from(elem) })),
      CHUNK_LENGTH,
    );

    // @ts-expect-error
    let userInputs = chunks.map((chunk) => new GameInputs({ ticks: chunk }));

    try {
      const proof = await workerClient?.proveGameRecord({
        bricks: level,
        inputs: userInputs,
        debug: Bool(false),
      });

      console.log('Level proof', proof);

      await client.start();

      const gameHub = client.runtime.resolve('GameHub');

      const tx = await client.transaction(PublicKey.fromBase58(networkStore.address!), () => {
        gameHub.addGameResult(proof!);
      });

      await tx.sign();
      await tx.send();
    } catch (e) {
      console.log('Error while generating ZK proof');
      console.log(e);
    }
  };

  return (
    <main className="flex grow flex-col items-center gap-5 p-5">
      {networkStore.address ? (
        <div className="flex flex-col gap-5">
          {gameState == GameState.Won && (
            <div>
              You won! Ticks verification:{' '}
              <input
                type="text"
                value={JSON.stringify(lastTicks)}
                readOnly
              ></input>
            </div>
          )}
          {gameState == GameState.Lost && (
            <div>You've lost! Nothing to prove</div>
          )}

          <div className="flex flex-row items-center justify-center gap-5">
            {(gameState == GameState.Won || gameState == GameState.Lost) && (
              <div
                className="rounded-xl bg-slate-300 hover:bg-slate-400 p-5"
                onClick={() => startGame()}
              >
                Restart
              </div>
            )}
            {gameState == GameState.NotStarted && (
              <div
                className="rounded-xl bg-slate-300 hover:bg-slate-400 p-5"
                onClick={() => startGame()}
              >
                Start for {competition?.enteringPrice} 🪙
              </div>
            )}
            {gameState == GameState.Won && (
              <div
                className="rounded-xl bg-slate-300 hover:bg-slate-400 p-5"
                onClick={() => proof()}
              >
                Send proof
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          className="rounded-xl bg-slate-300 p-5"
          onClick={async () => networkStore.connectWallet()}
        >
          Connect wallet
        </div>
      )}
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
        level={level}
        gameId={gameId}
        debug={debug}
        setScore={setScore}
        setTicksAmount={setTicksAmount}
      />
      <div>Score: {score}</div>
      <div>Ticks: {ticksAmount}</div>
      <div className="grow"></div>
      <div className="flex flex-col gap-10">
        <div>
          Leaderboard {params.competitionId}:
          <div>
            {topUsers.map((user) => (
              <div key={user.address}>
                {user.address} – {user.score} pts
              </div>
            ))}
          </div>
        </div>
        <div>
          Active competitions:
          <div className="flex flex-col">
            {arkanoidCompetitions.map((competition) => (
              <Link href={`/arkanoid/${competition.id}`} key={competition.id}>
                {competition.name} – {competition.prizeFund} 🪙
              </Link>
            ))}
          </div>
        </div>
      </div>
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
  );
}
