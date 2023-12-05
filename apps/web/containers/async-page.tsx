"use client";
import { useWalletStore } from "@/lib/stores/wallet";
import {
  FIELD_SIZE,
  GAME_LENGTH,
  Brick,
  Bricks,
  GameInputs,
  GameRecordProof,
  Tick,
  client,
  checkGameRecord,
  loadGameContext,
  IntPoint,
  defaultLevel
} from "zknoid-chain-dev";
import { useEffect, useRef, useState } from "react";
import { Int64, PublicKey, UInt64, Bool } from "o1js";
import { DUMMY_PROOF } from "@/constants";
import { GameView } from "@/components/GameView";
// import { dummyBase64Proof } from './../node_modules/o1js/dist/web/lib/proof_system';
// import { Pickles } from 'o1js/dist/node/snarky';
// export { Pickles } from 'o1js/';

enum GameState {
  NotStarted,
  Active,
  Won,
  Lost,
  Replay,
  Proofing
}

export default function Home() {
  const wallet = useWalletStore();
  const [address, setAddress] = useState("");
  const [gameState, setGameState] = useState(GameState.NotStarted);
  const [lastTicks, setLastTicks] = useState<number[]>([]);
  let [gameId, setGameId] = useState(0);


  const connectWallet = async () => {
    const accounts = await (window as any).mina.requestAccounts();
    setAddress(accounts[0]);
  };

  const startGame = () => {
    setGameState(GameState.Active);
    setGameId(gameId + 1);
  }

  const proof = () => {
    setGameState(GameState.Active);
    setGameId(gameId + 1);
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
            {gameState == GameState.Won || gameState == GameState.Lost && (
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
        gameId={gameId} />
    </main>
  );
}
