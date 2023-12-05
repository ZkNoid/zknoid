"use client";
import { useWalletStore } from "@/lib/stores/wallet";
import {
  Bricks,
  GameInputs,
  Tick,
  loadGameContext,
  defaultLevel
} from "zknoid-chain-dev";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Int64, PublicKey, UInt64, Bool } from "o1js";
import { DUMMY_PROOF } from "@/constants";
import { Ball, Cart, IBrick } from "@/lib/types";

interface IGameViewProps {
    gameId: number;
    onWin: (ticks: number[]) => void
    onLost: (ticks: number[]) => void
}

export const GameView = (props: IGameViewProps) => {
    const canvas = useRef<HTMLCanvasElement>(null);
    const [ctx, setContext] = useState<
      CanvasRenderingContext2D | null | undefined
    >(null);
    const [animationId, setAnimationId] = useState(-1);
    const [win, setWin] = useState(false);
    const [lost, setLost] = useState(false);
  
    let ticksCache: number[] = [];
    let bricksLeft: number = 0;
  
    // const [ticks, setTicks] = useState<number[]>([]);
  

    let lastUpdateTime = Date.now();
    const tickPeriod = 1000;
  
    let ball: Ball;
    let cart: Cart;
    let bricks: IBrick[] = [];
    let stopped: boolean = false;
  
    useEffect(() => {
        if (props.gameId > 0)
            startGame();
      }, [props.gameId]);
  
    useEffect(() => {
      const ctx = canvas!.current?.getContext("2d");
      setContext(ctx);
    }, [canvas]);
  
    const gameLoop = (time: number) => {
      if (stopped) return;
  
      ctx!.clearRect(0, 0, canvas.current!.width, canvas.current!.height);
      moveCart();
      moveBall();
  
      drawBall();
      drawBricks();
  
      drawCart();
  
      if (Date.now() - lastUpdateTime > tickPeriod) {
        ticksCache.push(1);
        // setTicks([...ticksCache, 1]);
        lastUpdateTime = Date.now();
      }
  
      setAnimationId(requestAnimationFrame(gameLoop));
    };
  
    const moveCart = () => {
      cart.x += cart.dx;
  
      if (cart.x > canvas!.current!.width - cart.w) {
        cart.x = canvas!.current!.width - cart.w;
      }
  
      if (cart.x < 0) {
        cart.x = 0;
      }
    };
  
    const moveBall = () => {
      ball.x += ball.dx;
      ball.y += ball.dy;
  
      if (
        ball.x + ball.radius > canvas!.current!.width ||
        ball.x - ball.radius < 0
      ) {
        ball.dx *= -1;
      }
  
      if (
        ball.y + ball.radius > canvas!.current!.height ||
        ball.y - ball.radius < 0
      ) {
        ball.dy *= -1;
      }
  
      if (ball.y + ball.radius > canvas!.current!.height) {
        return onLost();
      }
  
      if (
        ball.x - ball.radius > cart.x &&
        ball.x + ball.radius < cart.x + cart.w &&
        ball.y + ball.radius > cart.y
      ) {
        ball.dy *= -1;
      }
  
      bricks.forEach((brick) => {
          if (brick.value > 0) {
            if (
              ball.x - ball.radius > brick.x &&
              ball.x + ball.radius < brick.x + brick.w &&
              ball.y + ball.radius > brick.y &&
              ball.y - ball.radius < brick.y + brick.h
            ) {
              ball.dy *= -1;
              brick.value = 0;
              bricksLeft -= 1;
  
              if (bricksLeft == 0) {
                stopped = true;
                return onWin();
            }
          }
        }
      });
    };
  
    const drawBall = () => {
      ctx!.beginPath();
      ctx!.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx!.fillStyle = "black";
      ctx!.fill();
      ctx!.closePath();
    };
  
    const drawBricks = () => {
      bricks.forEach((brick) => {
          ctx!.beginPath();
          ctx!.rect(brick.x, brick.y, brick.w, brick.h);
          ctx!.fillStyle = brick.value > 0 ? "#0095dd" : "transparent";
          ctx!.fill();
          ctx!.closePath();
        });
    };
  
    const drawCart = () => {
      ctx!.beginPath();
      ctx!.rect(cart.x, cart.y, cart.w, cart.h);
      ctx!.fillStyle = "red";
      ctx!.fill();
      ctx!.closePath();
    };
  
    const keyDown = (e: KeyboardEvent) => {
      if (e.key === "Right" || e.key === "ArrowRight") {
        if (
          Date.now() - lastUpdateTime > tickPeriod ||
          ticksCache[ticksCache.length - 1] != 2
        ) {
          ticksCache.push(2);
        //   setTicks([...ticksCache, 2]);
          lastUpdateTime = Date.now();
        }
  
        cart.dx = 4;
      } else if (e.key === "Left" || e.key === "ArrowLeft") {
        if (
          Date.now() - lastUpdateTime > tickPeriod ||
          ticksCache[ticksCache.length - 1] != 0
        ) {
          ticksCache.push(0);
        //   setTicks([...ticksCache, 0]);
          lastUpdateTime = Date.now();
        }
  
        cart.dx = -4;
      }
    };
  
    const keyUp = (e: KeyboardEvent) => {
      if (
        e.key === "Right" ||
        e.key === "ArrowRight" ||
        e.key === "Left" ||
        e.key === "ArrowLeft"
      ) {
        cart.dx = 0;
      }
    };

    const level: Bricks = useMemo(() => defaultLevel(), []);
  
    const startGame = () => {
      setLost(false);
      setWin(false);
      stopped = false;
      bricksLeft = level.bricks.length;
  
      ball = {
        x: canvas!.current!.width / 2,
        y: canvas!.current!.height / 2,
        dx: 4,
        dy: -3,
        radius: 3,
      };
  
      cart = {
        x: canvas!.current!.width / 2,
        y: canvas!.current!.height - 10,
        w: 100,
        h: 20,
        dx: 0,
      };
  
      const commonBrick = {
        w: 30,
        h: 30,
        gap: 20,
      };

      for (let i = 0; i < bricks.length; i++) {
      }

      console.log('Level bricks', level.bricks);
  
      for (let i = 0; i < level.bricks.length; i++) {
        const brickValue = level.bricks[i].value * 1;
        if (brickValue > 0)
          bricks[i] = { 
            x: level.bricks[i].pos.x * 1, 
            y: level.bricks[i].pos.y * 1, 
            value: brickValue, 
            ...commonBrick 
        };
      }

      console.log(' bricks', bricks);

  
      if (
        ball.x - ball.radius > cart.x &&
        ball.x + ball.radius < cart.x + cart.w &&
        ball.y + ball.radius > cart.y
      ) {
        ball.dy = -ball.dy;
      }
  
      gameLoop(-1);
  
      document.addEventListener("keydown", keyDown);
      document.addEventListener("keyup", keyUp);
    };
    const onWin = async () => {
        stopped = true;

        props.onWin(ticksCache);
        return;

    }

    const onLost = async () => {
        stopped = true;

        props.onLost(ticksCache);
        return;
        
        // client.start();
        // const gameHub = client.runtime.resolve('GameHub');
        // const sender = PublicKey.fromBase58(address);
    
        // const tx1 = await client.transaction(sender, () => {
        //     gameHub.addGameResult(sender, GameRecordProof.fromJSON(DUMMY_PROOF));
        // });
    
        // await tx1.sign();
        // await tx1.send();
    
        // const sender = PublicKey.fromBase58(address);
    
        // const tx = await client.transaction(sender, () => {
        //   balances.addBalance(sender, UInt64.from(1000));
        // });
    
        // @ts-expect-error
        let userInput = new GameInputs({
          tiks: ticksCache.map(
            // @ts-expect-error
            (elem) => new Tick({ action: UInt64.from(elem) }),
          ),
        });
        try {
          const gameContext = loadGameContext(bricks, new Bool(true));
    
          for (let i = 0; i < userInput.tiks.length; i++) {
              gameContext.processTick(userInput.tiks[i]);
          }
    
        } catch (e) {
          console.log("Error while generating ZK proof");
          console.log(e);
        }
      };
    
  return <canvas id="canvas" width="500" height="500" ref={canvas}></canvas>;
}