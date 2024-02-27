'use client';

import { useContext, useEffect, useState } from 'react';
import { GameView } from './GameView';
import { Int64, PublicKey, UInt32, UInt64 } from 'o1js';
import Link from 'next/link';
import { useNetworkStore } from '@/lib/stores/network';
import { useMinaBridge } from '@/lib/stores/protokitBalances';
import { randzuCompetitions } from '@/app/constants/randzuCompetitions';
import {
  useObserveRandzuMatchQueue,
  useRandzuMatchQueueStore,
} from '@/games/randzu/stores/matchQueue';
import { walletInstalled } from '@/lib/helpers';
import { useStore } from 'zustand';
import { useSessionKeyStore } from '@/lib/stores/sessionKeyStorage';
import { RandzuField, WinWitness } from 'zknoid-chain-dev';
import GamePage from '@/components/framework/GamePage';
import { randzuConfig } from '../config';
import AppChainClientContext from '@/lib/contexts/AppChainClientContext';
import { getRandomEmoji } from '../utils';

enum GameState {
  NotStarted,
  MatchRegistration,
  Matchmaking,
  Active,
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

  const client = useContext(AppChainClientContext);

  if (!client) {
    throw Error('Context app chain client is not set');
  }

  useObserveRandzuMatchQueue();

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

  const bridge = useMinaBridge();

  const restart = () => {
    matchQueue.resetLastGameState();
    setGameState(GameState.NotStarted);
  };

  const startGame = async () => {
    if (competition!.enteringPrice > 0) {
      console.log(await bridge(competition?.enteringPrice! * 10 ** 9));
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

  const onCellClicked = async (x: number, y: number) => {
    if (!matchQueue.gameInfo?.isCurrentUserMove) return;
    if (matchQueue.gameInfo.field[x][y] != 0) return;

    const currentUserId = matchQueue.gameInfo.currentUserIndex + 1;

    const updatedField = matchQueue.gameInfo.field.map((x) => [...x]);
    updatedField[y][x] = matchQueue.gameInfo.currentUserIndex + 1;

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
    if (matchQueue.inQueue && !matchQueue.activeGameId) {
      setGameState(GameState.Matchmaking);
    } else if (matchQueue.activeGameId) {
      setGameState(GameState.Active);
    } else {
      if (matchQueue.lastGameState == 'win') setGameState(GameState.Won);

      if (matchQueue.lastGameState == 'lost') setGameState(GameState.Lost);
    }
  }, [matchQueue.activeGameId, matchQueue.inQueue, matchQueue.lastGameState]);

  return (
    <GamePage gameConfig={randzuConfig}>
      <main className="flex grow flex-col items-center gap-5 p-5">
        {networkStore.address ? (
          <div className="flex flex-col gap-5">
            {gameState == GameState.Won && (
              <div>{getRandomEmoji('happy')} You won!</div>
            )}
            {gameState == GameState.Lost && (
              <div>{getRandomEmoji('sad')} You lost!</div>
            )}

            <div className="flex flex-row items-center justify-center gap-5">
              {(gameState == GameState.Won || gameState == GameState.Lost) && (
                <div
                  className="rounded-xl border-2 border-left-accent bg-bg-dark p-5 hover:bg-left-accent hover:text-bg-dark"
                  onClick={() => restart()}
                >
                  Restart
                </div>
              )}
              {gameState == GameState.NotStarted && (
                <div
                  className="rounded-xl border-2 border-left-accent bg-bg-dark p-5 hover:bg-left-accent hover:text-bg-dark"
                  onClick={() => startGame()}
                >
                  Start for {competition?.enteringPrice} 🪙
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

        {gameState == GameState.MatchRegistration && (
          <div>Registering in the match pool 📝 ...</div>
        )}
        {gameState == GameState.Matchmaking && (
          <div>Searching for opponents 🔍 ...</div>
        )}
        {gameState == GameState.Active && (
          <div className="flex flex-col items-center gap-2">
            <>Game started. </>
            Opponent: {matchQueue.gameInfo?.opponent.toBase58()}
            {matchQueue.gameInfo?.isCurrentUserMove &&
              !matchQueue.gameInfo?.winner &&
              !loading && <div>✅ Your turn. </div>}
            {!matchQueue.gameInfo?.isCurrentUserMove &&
              !matchQueue.gameInfo?.winner &&
              !loading && <div>✋ Opponent&apos;s turn. </div>}
            {loading && <div> ⏳ Transaction execution </div>}
            {matchQueue.gameInfo?.winner && (
              <div> Winner: {matchQueue.gameInfo?.winner.toBase58()}. </div>
            )}
          </div>
        )}

        <GameView
          gameInfo={matchQueue.gameInfo}
          onCellClicked={onCellClicked}
          loadingElement={loadingElement}
          loading={loading}
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
    </GamePage>
  );
}
