'use client';

import { useEffect, useMemo, useState } from 'react';
import { GameView, ITick } from '@/components/randzu/GameView';
import {
  Bricks,
  GameInputs,
  Tick,
  defaultLevel,
  CHUNK_LENGTH,
} from 'zknoid-chain-dev';
import { Bool, Int64, PrivateKey, PublicKey, UInt64 } from 'o1js';
import Link from 'next/link';
import ZknoidWorkerClient from '@/worker/zknoidWorkerClient';
import { useNetworkStore } from '@/lib/stores/network';
import { useMinaBridge, useObserveProtokitBalance, useProtokitBalancesStore } from '@/lib/stores/protokitBalances';
import {
  useArkanoidLeaderboardStore,
  useObserveArkanoidLeaderboard,
} from '@/lib/stores/arkanoidLeaderboard';
import { useClientStore } from '@/lib/stores/client';
import { usePollMinaBlockHeight } from '@/lib/stores/minaChain';
import { usePollProtokitBlockHeight } from '@/lib/stores/protokitChain';
import { useMinaBalancesStore, useObserveMinaBalance } from '@/lib/stores/minaBalances';
import Header from '../Header';
import { GameType } from '@/app/constants/games';
import { randzuCompetitions } from '@/app/constants/randzuCompetitions';
import { useObserveRandzuMatchQueue, useRandzuMatchQueueStore } from '@/lib/stores/randzu/matchQueue';
import { walletInstalled } from '@/lib/utils';

enum GameState {
  NotStarted,
  MatchRegistration,
  Matchmaking,
  Active,
  Won,
  Lost,
  Replay,
  Proofing,
}

const chunkenize = (arr: any[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size),
  );

export default function RandzuPage({
  params,
}: {
  params: { competitionId: string };
}) {
  const [gameState, setGameState] = useState(GameState.NotStarted);
  const [lastTicks, setLastTicks] = useState<ITick[]>([]);
  const [score, setScore] = useState<number>(0);
  const [ticksAmount, setTicksAmount] = useState<number>(0);
  const competition = randzuCompetitions.find(
    (x) => x.id == params.competitionId,
  );

  const client = useClientStore();

  useObserveArkanoidLeaderboard(params.competitionId);
  usePollMinaBlockHeight();
  usePollProtokitBlockHeight();
  useObserveMinaBalance();
  useObserveProtokitBalance();
  useObserveRandzuMatchQueue();

  const minaBalances = useMinaBalancesStore();
  const protokitBalances = useProtokitBalancesStore();
  const leaderboardStore = useArkanoidLeaderboardStore();

  let [gameId, setGameId] = useState(0);
  let [debug, setDebug] = useState(true);
  const level: Bricks = useMemo(() => defaultLevel(), []);
  const [workerClient, setWorkerClient] = useState<ZknoidWorkerClient | null>(
    null,
  );
  const networkStore = useNetworkStore();
  const matchQueue = useRandzuMatchQueueStore();

  const bridge = useMinaBridge(competition?.enteringPrice! * 10 ** 9);

  const startGame = async () => {
    if (competition!.enteringPrice > 0) {
      console.log(await bridge());
    }

    const matchMaker = client.client!.runtime.resolve('MatchMaker');
    const key = PrivateKey.random();

    const tx = await client.client!.transaction(
      PublicKey.fromBase58(networkStore.address!),
      () => {
        matchMaker.register(key.toPublicKey(), UInt64.from(Math.round(Date.now() / 1000)));
      },
    );

    await tx.sign();
    await tx.send();

    setGameState(GameState.MatchRegistration);

    // setGameId(gameId + 1);
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

  useEffect(() => {
    client.start();
  }, []);

  const proof = async () => {
    console.log('Ticks', lastTicks);

    let chunks = chunkenize(
      lastTicks.map(
        (elem) =>
          // @ts-expect-error
          new Tick({
            action: Int64.from(elem.action),
            momentum: Int64.from(elem.momentum),
          }),
      ),
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

      const gameHub = client.client!.runtime.resolve('GameHub');

      const tx = await client.client!.transaction(
        PublicKey.fromBase58(networkStore.address!),
        () => {
          gameHub.addGameResult(proof!);
        },
      );

      await tx.sign();
      await tx.send();
    } catch (e) {
      console.log('Error while generating ZK proof');
      console.log(e);
    }
  };

  return (
    <>
      <Header
        address={networkStore.address}
        connectWallet={networkStore.connectWallet}
        minaBalance={networkStore.address ? minaBalances.balances[networkStore.address] : 0n}
        protokitBalance={networkStore.address ? protokitBalances.balances[networkStore.address] : 0n}
        walletInstalled={networkStore.walletInstalled()}
        currentGame={GameType.Arkanoid}
      />
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
                  className="rounded-xl bg-slate-300 p-5 hover:bg-slate-400"
                  onClick={() => startGame()}
                >
                  Restart
                </div>
              )}
              {gameState == GameState.NotStarted && (
                <div
                  className="rounded-xl bg-slate-300 p-5 hover:bg-slate-400"
                  onClick={() => startGame()}
                >
                  Start for {competition?.enteringPrice} 🪙
                </div>
              )}
              {gameState == GameState.Won && (
                <div
                  className="rounded-xl bg-slate-300 p-5 hover:bg-slate-400"
                  onClick={() => proof()}
                >
                  Send proof
                </div>
              )}
            </div>
          </div>
        ) : 
          walletInstalled() ? (
            <div
              className="rounded-xl bg-slate-300 p-5"
              onClick={async () => networkStore.connectWallet()}
            >
              Connect wallet
            </div>
          ) : (
            <Link href="https://www.aurowallet.com/"
              className="rounded-xl bg-slate-300 p-5"
              rel="noopener noreferrer" target="_blank"
            >
                Install wallet
            </Link>
          )}

        {gameState == GameState.MatchRegistration && (
          <div>
            Registering in the match pool 📝 ...
          </div>
        )} 
        {gameState == GameState.Matchmaking && (
          <div>
            Searching for opponents 🔍 ...
          </div>
        )} 

        <GameView
          onWin={(ticks) => {
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
        <div>Players in queue: {matchQueue.getQueueLength()}</div>
        <div className="grow"></div>
        <div className="flex flex-col gap-10">
          <div>
            Leaderboard {params.competitionId}:
            <div>
              {leaderboardStore
                .getLeaderboard(params.competitionId)
                .map((user, i) => (
                  <div key={i}>
                    {user.player.toBase58()} – {user.score.toString()} pts
                  </div>
                ))}
            </div>
          </div>
          <div>
            Active competitions:
            <div className="flex flex-col">
              {randzuCompetitions.map((competition) => (
                <Link
                  href={`/games/randzu/${competition.id}`}
                  key={competition.id}
                >
                  {competition.name} – {competition.prizeFund} 🪙
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
