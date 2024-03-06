import GamePage from '@/components/framework/GamePage';
import { thimblerigConfig } from '../config';
import Link from 'next/link';
import { useNetworkStore } from '@/lib/stores/network';
import { useContext, useState } from 'react';
import AppChainClientContext from '@/lib/contexts/AppChainClientContext';
import { getRandomEmoji } from '@/games/randzu/utils';
import { useMatchQueueStore } from '@/lib/stores/matchQueue';
import { ClientAppChain } from 'zknoid-chain-dev';
import { PublicKey, UInt64 } from 'o1js';
import { useStore } from 'zustand';
import { useSessionKeyStore } from '@/lib/stores/sessionKeyStorage';
import { walletInstalled } from '@/lib/helpers';
import { useObserveThimblerigMatchQueue } from '../stores/matchQueue';

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

  let [loading, setLoading] = useState(true);

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

        <div>Players in queue: {matchQueue.getQueueLength()}</div>
      </main>
    </GamePage>
  );
}
