"use client";

import { useEffect, useRef, useState } from "react";
import { GameView, ITick } from "./components/GameView";
import { Bricks } from "zknoid-chain-dev";
import { useNetworkStore } from "@sdk/lib/stores/network";
import { useSwitchWidgetStorage } from "@sdk/lib/stores/switchWidgetStorage";
import { useWorkerClientStore } from "@sdk/lib/stores/workerClient";
import {
  useArkanoidLeaderboardStore,
  useObserveArkanoidLeaderboard,
} from "./stores/arkanoidLeaderboard";
import { useStartGame } from "./features/useStartGame";
import { useProof } from "./features/useProof";
import { useGetCompetition } from "./features/useGetCompetition";
import { arkanoidConfig } from "./config";
import { walletInstalled } from "@sdk/lib/helpers";
import { ICompetition } from "@sdk/lib/types";
import GameWidget from "@sdk/components/framework/GameWidget";
import { Leaderboard } from "@sdk/components/framework/GameWidget/ui/Leaderboard";
import { Competition } from "@sdk/components/framework/GameWidget/ui/Competition";
import { ConnectWallet } from "@sdk/components/framework/GameWidget/ui/popups/ConnectWallet";
import { RateGame } from "@sdk/components/framework/GameWidget/ui/popups/RateGame";
import { Lost } from "@sdk/components/framework/GameWidget/ui/popups/Lost";
import { Win } from "@sdk/components/framework/GameWidget/ui/popups/Win";
import { InstallWallet } from "@sdk/components/framework/GameWidget/ui/popups/InstallWallet";
import { DebugCheckbox } from "@sdk/components/framework/GameWidget/ui/DebugCheckbox";
import { UnsetCompetitionPopup } from "@sdk/components/framework/GameWidget/ui/popups/UnsetCompetitionPopup";
import { FullscreenButton } from "@sdk/components/framework/GameWidget/ui/FullscreenButton";
import { FullscreenWrap } from "@sdk/components/framework/GameWidget/ui/FullscreenWrap";
import { PreRegModal } from "./ui/PreRegModal";
import Button from "@sdk/components/shared/Button";
import ArkanoidCoverSVG from "./assets/game-cover.svg";
import ArkanoidMobileCoverSVG from "./assets/game-cover-mobile.svg";
import { GameState } from "./lib/gameState";
import GamePage from "@sdk/components/framework/GamePage";

export default function Arkanoid({
  params,
}: {
  params: { competitionId: string };
}) {
  const [gameState, setGameState] = useState(GameState.NotStarted);
  const [lastTicks, setLastTicks] = useState<ITick[]>([]);
  const [score, setScore] = useState<number>(0);
  const [ticksAmount, setTicksAmount] = useState<number>(0);
  const [competition, setCompetition] = useState<ICompetition>();
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isPreRegModalOpen, setIsPreRegModalOpen] = useState<boolean>(false);
  const [gameId, setGameId] = useState(0);
  const [debug, setDebug] = useState(false);
  const [level, setLevel] = useState<Bricks>(Bricks.empty);

  const shouldUpdateLeaderboard = useRef(false);
  const leaderboardStore = useArkanoidLeaderboardStore();
  const switchStore = useSwitchWidgetStorage();
  const workerClientStore = useWorkerClientStore();
  const networkStore = useNetworkStore();
  useObserveArkanoidLeaderboard(params.competitionId, shouldUpdateLeaderboard);

  const startGame = useStartGame(setGameState, gameId, setGameId, competition);
  const proof = useProof(lastTicks, competition, score);
  const getCompetition = useGetCompetition(
    +params.competitionId,
    setCompetition,
    setLevel,
  );

  const isRestartButton =
    gameState === GameState.Lost || gameState === GameState.Won;

  useEffect(() => {
    if (!networkStore.protokitClientStarted) return;
    getCompetition();
  }, [networkStore.protokitClientStarted]);

  useEffect(() => {
    gameState == GameState.Active
      ? (shouldUpdateLeaderboard.current = false)
      : (shouldUpdateLeaderboard.current = true);
  }, [gameState]);

  useEffect(() => {
    if (
      competition &&
      params.competitionId != switchStore.competitionId?.toString()
    )
      switchStore.setCompetitionId(competition.id);
  }, [competition, params.competitionId, switchStore.competitionId]);

  useEffect(() => {
    if (
      competition &&
      competition.competitionDate.start.getTime() > Date.now()
    ) {
      setIsPreRegModalOpen(true);
    }
  }, [competition]);

  return (
    <GamePage gameConfig={arkanoidConfig} gameTitleImage={ArkanoidCoverSVG}>
      <FullscreenWrap isFullscreen={isFullscreen}>
        {competition && (
          <>
            <Leaderboard
              leaderboard={leaderboardStore.getLeaderboard(
                params.competitionId,
              )}
            />
            <div className={"flex flex-col gap-4 lg:hidden"}>
              <span className={"w-full text-headline-2 font-bold"}>Rules</span>
              <span
                className={
                  "whitespace-pre-line font-plexsans text-buttons-menu font-normal"
                }
              >
                {competition ? competition.game.rules : <> - </>}
              </span>
            </div>
          </>
        )}

        <GameWidget
          gameId={arkanoidConfig.id}
          ticks={ticksAmount}
          score={score}
          author={arkanoidConfig.author}
        >
          {networkStore.address ? (
            <>
              {!competition ? (
                <UnsetCompetitionPopup gameId={arkanoidConfig.id} />
              ) : (
                <>
                  {gameState == GameState.Won && (
                    <Win
                      onBtnClick={() => {
                        proof()
                          .then(() => setGameState(GameState.Proofing))
                          .catch((error) => {
                            console.log(error);
                          });
                      }}
                      title={"You won! Congratulations!"}
                      subTitle={
                        "If you want to see your name in leaderboard you have to send the poof! ;)"
                      }
                      btnText={"Send proof"}
                    />
                  )}
                  {gameState == GameState.Proofing && (
                    <div
                      className={
                        "flex h-full w-full flex-col items-center justify-center px-[10%] py-[15%] text-headline-1 text-left-accent lg:p-0"
                      }
                    >
                      <div
                        className={
                          "flex max-w-[60%] flex-col items-center justify-center gap-4"
                        }
                      >
                        <span className={"text-center"}>
                          Your Proof was sent - now you can see your name in
                          Leaderboard :)
                        </span>
                        <Button
                          label={"Close"}
                          onClick={() => setGameState(GameState.RateGame)}
                        />
                      </div>
                    </div>
                  )}
                  {gameState == GameState.Lost && (
                    <Lost startGame={startGame} />
                  )}
                  {gameState == GameState.RateGame && (
                    <RateGame
                      gameId={arkanoidConfig.id}
                      onClick={() => setGameState(GameState.NotStarted)}
                    />
                  )}
                  {gameState === GameState.NotStarted && (
                    <div
                      className={
                        "flex min-h-[50vh] w-full items-center justify-center lg:h-full lg:min-h-min"
                      }
                    >
                      {workerClientStore.status == "Initialized" ? (
                        <button
                          className={
                            "w-full max-w-[80%] rounded-[5px] border border-bg-dark bg-left-accent py-2 text-center text-[20px]/[20px] font-medium text-dark-buttons-text hover:border-left-accent hover:bg-bg-dark hover:text-left-accent lg:max-w-[40%]"
                          }
                          onClick={startGame}
                        >
                          Start game
                        </button>
                      ) : (
                        <div
                          className={
                            "w-full max-w-[80%] rounded-[5px] border border-bg-dark bg-left-accent py-2 text-center text-[20px]/[20px] font-medium text-dark-buttons-text lg:max-w-[40%]"
                          }
                        >
                          {" "}
                          Wait for initialization
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          ) : walletInstalled() ? (
            <ConnectWallet
              connectWallet={() => networkStore.connectWallet(false)}
            />
          ) : (
            <InstallWallet />
          )}
          {gameState === GameState.Active && (
            <div
              className={
                "flex h-full w-full items-center justify-center p-[10%] lg:p-0"
              }
            >
              <GameView
                onWin={(ticks) => {
                  console.log("Ticks", ticks);
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
          <FullscreenButton
            isFullscreen={isFullscreen}
            setIsFullscreen={setIsFullscreen}
          />
        </GameWidget>
        <span className={"block w-full text-headline-2 font-bold lg:hidden"}>
          Game
        </span>
        <Competition
          startGame={startGame}
          competition={competition}
          isRestartBtn={isRestartButton}
        />
        {isPreRegModalOpen && competition && (
          <PreRegModal competition={competition} />
        )}
      </FullscreenWrap>
      <DebugCheckbox debug={debug} setDebug={setDebug} />
    </GamePage>
  );
}
