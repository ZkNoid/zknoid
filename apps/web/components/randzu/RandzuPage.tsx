'use client';

import { useEffect, useMemo, useState } from 'react';
import { GameView } from '@/components/randzu/GameView';
import {
  Bricks,
  GameInputs,
  Tick,
  defaultLevel,
  CHUNK_LENGTH,
} from 'zknoid-chain-dev';
import { Bool, Int64, PrivateKey, PublicKey, Signature, UInt32, UInt64 } from 'o1js';
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
import { useStore } from 'zustand';
import { useSessionKeyStore } from '@/lib/stores/randzu/sessionKeyStorage';
import { RandzuField, WinWitness } from 'zknoid-chain-dev/dist/RandzuLogic';

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

export default function RandzuPage({
  params,
}: {
  params: { competitionId: string };
}) {
  const [gameState, setGameState] = useState(GameState.NotStarted);
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

  let [gameId, setGameId] = useState(0);
  let [debug, setDebug] = useState(true);
  let [loading, setLoading] = useState(true);
  let [loadingElement, setLoadingElement] = useState<{x: number, y: number} | undefined>({x: 0, y: 0});

  const [workerClient, setWorkerClient] = useState<ZknoidWorkerClient | null>(
    null,
  );
  const networkStore = useNetworkStore();
  const matchQueue = useRandzuMatchQueueStore();
  const sessionPublicKey = useStore(useSessionKeyStore, (state) => state.getSessionKey()).toPublicKey();
  const sessionPrivateKey = useStore(useSessionKeyStore, (state) => state.getSessionKey());

  const bridge = useMinaBridge();

  const startGame = async () => {
    if (competition!.enteringPrice > 0) {
      console.log(await bridge(competition?.enteringPrice! * 10 ** 9));
    }

    const randzuLogic = client.client!.runtime.resolve('RandzuLogic');

    const tx = await client.client!.transaction(
      PublicKey.fromBase58(networkStore.address!),
      () => {
        randzuLogic.register(sessionPublicKey, UInt64.from(Math.round(Date.now() / 1000)));
      },
    );

    await tx.sign();
    await tx.send();

    setGameState(GameState.MatchRegistration);
  };

  const onCellClicked = async (x: number, y: number) => {
    if (!matchQueue.gameInfo?.isCurrentUserMove) return;

    const currentUserId = matchQueue.gameInfo.currentUserIndex + 1;

    const updatedField = matchQueue.gameInfo.field.map(x => [...x]);
    updatedField[y][x] = matchQueue.gameInfo.currentUserIndex + 1;

    const randzuLogic = client.client!.runtime.resolve('RandzuLogic');

    const updatedRandzuField = RandzuField.from(updatedField);

    const winWitness1 = updatedRandzuField.checkWin(currentUserId);

    const tx = await client.client!.transaction(
      sessionPrivateKey.toPublicKey(),
      () => {
        randzuLogic.makeMove(
          UInt64.from(matchQueue.gameInfo!.gameId), 
          updatedRandzuField, 
          winWitness1 ?? new WinWitness(
            // @ts-ignore
            {
              x: UInt32.from(0),
              y: UInt32.from(0),
              directionX: Int64.from(0),
              directionY: Int64.from(0),
            }
          )
        );
      },
    );

    setLoading(true);
    setLoadingElement({
      x, y
    });

    // await tx.sign();
    tx.transaction = tx.transaction?.sign(sessionPrivateKey);
    await tx.send();
  }

  useEffect(() => {
    setLoading(false);
    setLoadingElement(undefined);
  }, [matchQueue.gameInfo?.isCurrentUserMove]);

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

  useEffect(() => {
    if (matchQueue.inQueue && !matchQueue.activeGameId) {
      setGameState(GameState.Matchmaking);
    }

    if (matchQueue.activeGameId) {
      setGameState(GameState.Active);
    }

  }, [matchQueue.activeGameId, matchQueue.inQueue]);

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
                You won!
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
                >
                  Play again
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
        {gameState == GameState.Active && (
          <div className='flex flex-col gap-2 items-center'>
            <>Game started. </>
            Opponent: {matchQueue.gameInfo?.opponent.toBase58()}
            {matchQueue.gameInfo?.isCurrentUserMove && !matchQueue.gameInfo?.winner && !loading && (<div> Your move. </div>)} 
            {loading && (<div> ⏳ Transaction execution </div>)} 

            {matchQueue.gameInfo?.winner && (<div> Winner: {matchQueue.gameInfo?.winner.toBase58()}. </div>)} 

          </div>
        )} 

        <GameView
          gameId={gameId}
          debug={debug}
          gameInfo={matchQueue.gameInfo}
          onCellClicked={onCellClicked}
          loadingElement={loadingElement}
        />
        <div>Players in queue: {matchQueue.getQueueLength()}</div>
        <div className="grow"></div>
        <div className="flex flex-col gap-10">
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
