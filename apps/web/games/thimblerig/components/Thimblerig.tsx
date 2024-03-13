import GamePage from '@/components/framework/GamePage';
import { thimblerigConfig } from '../config';
import Link from 'next/link';
import { useNetworkStore } from '@/lib/stores/network';
import { useContext, useEffect, useState } from 'react';
import AppChainClientContext from '@/lib/contexts/AppChainClientContext';
import { getRandomEmoji } from '@/games/randzu/utils';
import { useMatchQueueStore } from '@/lib/stores/matchQueue';
import { ClientAppChain, MOVE_TIMEOUT_IN_BLOCKS, PENDING_BLOCKS_NUM_CONST } from 'zknoid-chain-dev';
import { Field, Poseidon, PublicKey, UInt64 } from 'o1js';
import { useStore } from 'zustand';
import { useSessionKeyStore } from '@/lib/stores/sessionKeyStorage';
import { walletInstalled } from '@/lib/helpers';
import { useObserveThimblerigMatchQueue } from '../stores/matchQueue';
import { useCommitmentStore } from '@/lib/stores/commitmentStorage';
import { useProtokitChainStore } from '@/lib/stores/protokitChain';

enum GameState {
  NotStarted,
  MatchRegistration,
  Matchmaking,
  Active,
  Won,
  Lost,
}

export default function Thimblerig({}: { params: { competitionId: string } }) {
  const client = useContext(AppChainClientContext) as ClientAppChain<
    typeof thimblerigConfig.runtimeModules
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
  let commitmentStore = useCommitmentStore();
  const protokitChain = useProtokitChainStore();

  const restart = () => {
    matchQueue.resetLastGameState();
    setGameState(GameState.NotStarted);
  };

  const startGame = async () => {
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

  /**
   *
   * @param id Number 0-2
   */
  const commitThumblerig = async (id: number) => {
    const salt = commitmentStore.commit(id);

    const thimblerigLogic = client.runtime.resolve('ThimblerigLogic');

    const tx = await client.transaction(
      PublicKey.fromBase58(networkStore.address!),
      () => {
        thimblerigLogic.commitValue(
          UInt64.from(matchQueue.activeGameId),
          UInt64.from(id),
          salt
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
    const randzuLogic = client.runtime.resolve('ThimblerigLogic');

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

  useEffect(() => {
    if (matchQueue.inQueue && !matchQueue.activeGameId) {
      setGameState(GameState.Matchmaking);
    } else if (matchQueue.activeGameId) {
      setGameState(GameState.Active);
    } else {
      if (matchQueue.lastGameState == 'win') setGameState(GameState.Won);
      else if (matchQueue.lastGameState == 'lost') setGameState(GameState.Lost);
      else {
        setGameState(GameState.NotStarted);
      }
    }
  }, [matchQueue.activeGameId, matchQueue.inQueue, matchQueue.lastGameState]);

  return (
    <GamePage gameConfig={thimblerigConfig}>
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
                  Start for 0 🪙
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
          <div>
            Searching for opponents{' '}
            {parseInt(protokitChain.block?.height ?? '0') %
              PENDING_BLOCKS_NUM_CONST}{' '}
            / {PENDING_BLOCKS_NUM_CONST}🔍 ...
          </div>
        )}
        {gameState == GameState.Active && (
          <div className="flex flex-col items-center gap-2">
            <>Game started. </>
            Opponent: {matchQueue.gameInfo?.opponent.toBase58()}
            {matchQueue.gameInfo.field.commitedHash.toBigInt() && (
              <div>
                Commited hash{' '}
                {matchQueue.gameInfo.field.commitedHash.toBigInt().toString()}
              </div>
            )}
            {matchQueue.gameInfo?.isCurrentUserMove &&
              !loading &&
              !matchQueue.gameInfo.field.commitedHash.toBigInt() &&
              !matchQueue.gameInfo.field.choice.toBigInt() && (
                <div className="flex flex-col items-center">
                  ✅ Choose thimblerig to hide ball behind.
                  <div className="flex flex-col items-center justify-center gap-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        className="flex flex-row items-center justify-center gap-3"
                        key={i}
                      >
                        Thimble {i}{' '}
                        <div
                          className="cursor-pointer rounded bg-middle-accent p-1 text-bg-dark"
                          onClick={() => commitThumblerig(i - 1)}
                        >
                          Hide
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            {matchQueue.gameInfo?.isCurrentUserMove &&
              !loading &&
              matchQueue.gameInfo.field.commitedHash.toBigInt() &&
              !matchQueue.gameInfo.field.choice.toBigInt() && (
                <div className="flex flex-col items-center">
                  ✅ Guess under what thimblerig ball is hidden by opponent
                  <div className="flex flex-col items-center justify-center gap-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        className="flex flex-row items-center justify-center gap-3"
                        key={i}
                      >
                        Thimble {i}{' '}
                        <div
                          className="cursor-pointer rounded bg-middle-accent p-1 text-bg-dark"
                          onClick={() => chooseThumblerig(i)}
                        >
                          Choose
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            {matchQueue.gameInfo?.isCurrentUserMove &&
              !loading &&
              matchQueue.gameInfo.field.commitedHash.toBigInt() &&
              matchQueue.gameInfo.field.choice.toBigInt() && (
                <div className="flex flex-col items-center">
                  ✅ Reveal the position
                  <div
                    className="cursor-pointer rounded bg-middle-accent p-1 text-bg-dark"
                    onClick={() => revealThumblerig()}
                  >
                    Reveal
                  </div>
                </div>
              )}
            {!matchQueue.gameInfo?.isCurrentUserMove &&
              !matchQueue.gameInfo?.winner &&
              !loading && <div>✋ Opponent&apos;s turn. </div>}
            {loading && <div> ⏳ Transaction execution </div>}
            {matchQueue.gameInfo?.winner && (
              <div> Winner: {matchQueue.gameInfo?.winner.toBase58()}. </div>
            )}
            {!matchQueue.gameInfo?.isCurrentUserMove &&
              BigInt(protokitChain?.block?.height || '0') -
                matchQueue.gameInfo?.lastMoveBlockHeight >
                MOVE_TIMEOUT_IN_BLOCKS && (
                <div className="flex flex-col items-center">
                  <div>
                    Opponent timeout {Number(protokitChain?.block?.height)}{' '}
                    {' / '}
                    {Number(matchQueue.gameInfo?.lastMoveBlockHeight)}
                  </div>
                  <div
                    className="rounded-xl border-2 border-left-accent bg-bg-dark p-5 hover:bg-left-accent hover:text-bg-dark"
                    onClick={() => proveOpponentTimeout()}
                  >
                    Prove win
                  </div>
                </div>
              )}
          </div>
        )}

        <div>Players in queue: {matchQueue.getQueueLength()}</div>
      </main>
    </GamePage>
  );
}
