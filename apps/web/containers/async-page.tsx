"use client";
import { useWalletStore } from "@/lib/stores/wallet";

import { useMemo, useState } from "react";
import { GameView } from "@/components/GameView";
import {
  Bricks,
  GameInputs,
  Tick,
  loadGameContext,
  defaultLevel
} from "zknoid-chain";
import { Bool, UInt64 } from "o1js";

enum GameState {
  NotStarted,
  Active,
  Won,
  Lost,
  Replay,
  Proofing
}

export default function Home() {
  const [address, setAddress] = useState("");
  const [gameState, setGameState] = useState(GameState.NotStarted);
  const [lastTicks, setLastTicks] = useState<number[]>([]);
  let [gameId, setGameId] = useState(0);
  const level: Bricks = useMemo(() => defaultLevel(), []);

  const connectWallet = async () => {
    const accounts = await (window as any).mina.requestAccounts();
    setAddress(accounts[0]);
  };

  const startGame = () => {
    setGameState(GameState.Active);
    setGameId(gameId + 1);
  }

  const proof = () => {
    console.log('Ticks', lastTicks)

    // @ts-expect-error
    let userInput = new GameInputs({
      tiks: lastTicks.map(
        // @ts-expect-error
        (elem) => new Tick({ action: UInt64.from(elem) }),
      ),
    });

    try {
      const gameContext = loadGameContext(level, new Bool(true));
      for (let i = 0; i < userInput.tiks.length; i++) {
          gameContext.processTick(userInput.tiks[i]);
      }
    } catch (e) {
      console.log("Error while generating ZK proof");
      console.log(e);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-5">
      {address ? (
        <div className="flex flex-col gap-5">
          {gameState == GameState.Won && (
            <div>
              You won! Ticks verification:{" "}
              <input type="text" value={JSON.stringify(lastTicks)} readOnly></input>
            </div>
          )}
          {gameState == GameState.Lost && <div>You've lost! Nothing to prove</div>}

          <div className="flex flex-row items-center justify-center gap-5">
            {(gameState == GameState.Won || gameState == GameState.Lost) && (
              <div
                className="rounded-xl bg-slate-300 p-5"
                onClick={() => startGame()}
              >
                Restart
              </div>
            )}
            {gameState == GameState.NotStarted && (
              <div
                className="rounded-xl bg-slate-300 p-5"
                onClick={() => startGame()}
              >
                Start
              </div>
            )}
            {gameState == GameState.Won && (
              <div
                className="rounded-xl bg-slate-300 p-5"
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
          onClick={() => connectWallet()}
        >
          Connect wallet
        </div>
      )}
      <GameView
        onWin={(ticks) => {
          console.log('Ticks', ticks)
          setLastTicks(ticks);
          setGameState(GameState.Won);
        }}
        onLost={(ticks) => {
          setLastTicks(ticks);
          setGameState(GameState.Lost)
        }} 
        level={level}
        gameId={gameId} 
      />
    </main>
  );
}
