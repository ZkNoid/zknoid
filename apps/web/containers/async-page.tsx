"use client";
import { Faucet } from "@/components/faucet";
import { useWalletStore } from "@/lib/stores/wallet";
// import { GameRecordProof, client } from "zknoid-chain";
import { useEffect, useRef, useState } from 'react'
import { PublicKey } from "o1js";
import { DUMMY_PROOF } from "@/constants";
// import { dummyBase64Proof } from './../node_modules/o1js/dist/web/lib/proof_system';
// import { Pickles } from 'o1js/dist/node/snarky';
// export { Pickles } from 'o1js/';

interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
}

interface Brick {
  x: number;
  y: number;
  w: number;
  h: number;
  active: boolean;
}

interface Cart {
  x: number;
  y: number;
  w: number;
  h: number;
  dx: number;
}

const bricksInRow = 5;
const bricksInCol = 2;

export default function Home() {
  const wallet = useWalletStore();

  const canvas = useRef<HTMLCanvasElement>(null);
  const [ctx, setContext] = useState<CanvasRenderingContext2D | null | undefined>(null);
  const [animationId, setAnimationId] = useState(-1);
  const [address, setAddress] = useState('');
  const [win, setWin] = useState(false);
  const [lost, setLost] = useState(false);

  let ticksCache: number[] = [];
  let bricksLeft: number = 0;

  const [ticks, setTicks] = useState<number[]>([]);

  let lastUpdateTime = Date.now();
  const tickPeriod = 1000;

  let ball: Ball;
  let cart: Cart;
  let bricks: Brick[][] = [];
  let stopped: boolean = false;

  useEffect(() => {
    const ctx = canvas!.current?.getContext('2d');
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
      setTicks([...ticksCache, 1]);
      lastUpdateTime = Date.now();
    }

    setAnimationId(requestAnimationFrame(gameLoop));
  }

  const moveCart = () => {

    cart.x += cart.dx;

    if (cart.x > canvas!.current!.width - cart.w) {
      cart.x = canvas!.current!.width - cart.w;
    }

    if (cart.x < 0) {
      cart.x = 0;
    }
  }

  const moveBall = () => {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x + ball.radius > canvas!.current!.width || ball.x - ball.radius < 0) {
      ball.dx *= -1;
    }

    if (ball.y + ball.radius > canvas!.current!.height || ball.y - ball.radius < 0) {
      ball.dy *= -1;
    }

    if (ball.y + ball.radius > canvas!.current!.height) {

      return endGame();

    }

    if (
      ball.x - ball.radius > cart.x &&
      ball.x + ball.radius < cart.x + cart.w &&
      ball.y + ball.radius > cart.y
    ) {
      ball.dy *= -1;
    }

    bricks.forEach(column => {
      column.forEach(brick => {
        if (brick.active) {
          if (
            ball.x - ball.radius > brick.x &&
            ball.x + ball.radius < brick.x + brick.w &&
            ball.y + ball.radius > brick.y &&
            ball.y - ball.radius < brick.y + brick.h
          ) {
            ball.dy *= -1;
            brick.active = false;
            bricksLeft -= 1;

            if (bricksLeft == 0) {
              stopped = true;
              setWin(true);
            }
          }
        }
      });
    });
  }

  const drawBall = () => {
    ctx!.beginPath();
    ctx!.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx!.fillStyle = 'black';
    ctx!.fill();
    ctx!.closePath();
  }

  const drawBricks = () => {
    bricks.forEach(column => {
      column.forEach(brick => {

        ctx!.beginPath();
        ctx!.rect(brick.x, brick.y, brick.w, brick.h);
        ctx!.fillStyle = brick.active ? '#0095dd' : 'transparent';
        ctx!.fill();
        ctx!.closePath();
      });
    });
  }

  const drawCart = () => {
    ctx!.beginPath();
    ctx!.rect(cart.x, cart.y, cart.w, cart.h);
    ctx!.fillStyle = 'red';
    ctx!.fill();
    ctx!.closePath();
  }

  const keyDown = (e: KeyboardEvent) => {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      if (Date.now() - lastUpdateTime > tickPeriod || ticks[ticks.length - 1] != 2) {
        ticksCache.push(2);
        setTicks([...ticksCache, 2]);
        lastUpdateTime = Date.now();
      }

      cart.dx = 4;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      if (Date.now() - lastUpdateTime > tickPeriod || ticks[ticks.length - 1] != 0) {
        ticksCache.push(0);
        setTicks([...ticksCache, 0]);
        lastUpdateTime = Date.now();
      }

      cart.dx = -4;
    }
  }

  const keyUp = (e: KeyboardEvent) => {
    if (
      e.key === 'Right' ||
      e.key === 'ArrowRight' ||
      e.key === 'Left' ||
      e.key === 'ArrowLeft'
    ) {
      cart.dx = 0;
    }
  }

  const startGame = () => {
    setLost(false);
    setWin(false);
    stopped = false;
    bricksLeft = bricksInRow * bricksInCol

    ball = {
      x: canvas!.current!.width / 2,
      y: canvas!.current!.height / 2,
      dx: 4,
      dy: -3,
      radius: 3
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
      active: true
    };

    for (let i = 0; i < bricksInRow; i++) {
      bricks[i] = [];
      for (let j = 0; j < bricksInCol; j++) {
        const x = i * (commonBrick.w + commonBrick.gap) + 200;
        const y = j * (commonBrick.h + commonBrick.gap) + 60;
        bricks[i][j] = { x, y, ...commonBrick };
      }
    }

    if (
      ball.x - ball.radius > cart.x &&
      ball.x + ball.radius < cart.x + cart.w &&
      ball.y + ball.radius > cart.y
    ) {
      ball.dy = -ball.dy;
    }

    gameLoop(-1);

    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);
  }

  const connectWallet = async () => {
    const accounts = await (window as any).mina.requestAccounts();
    setAddress(accounts[0])
  }

  const endGame = async () => {
    setLost(true);
    setWin(false);
    stopped = true;

    // @help porblem with deployement because of local package
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

    // const gameHub = client.runtime.resolve('GameHub');

    // const dummieField: GameField = new GameField({
    //     cells: [...new Array(FIELD_SIZE)].map(
    //         (elem) => new GameCell({ value: UInt64.from(0) })
    //     ),
    // });

    // let cheatInput: GameInputs = new GameInputs({
    //     tiks: [...new Array(GAME_LENGTH)].map(
    //         (elem) => new Tick({ action: UInt64.from(0) })
    //     ),
    // });

    // cheatInput.tiks[1] = new Tick({ action: UInt64.from(1) });
    // cheatInput.tiks[2] = new Tick({ action: UInt64.from(2) });
    // cheatInput.tiks[3] = new Tick({ action: UInt64.from(1) });
    // cheatInput.tiks[4] = new Tick({ action: UInt64.from(0) });

    // dummyBase64Proof();

    // const gameProof = await mockProof(
    //     checkGameRecord(dummieField, cheatInput)
    // );



    // const lastSeed =
    //     (await appChain.query.runtime.GameHub.lastSeed.get()) ??
    //     UInt64.from(0);
    // console.log(lastSeed);


    // const alice = alicePrivateKey.toPublicKey();

    // await appChain.start();


    // const gameHub = appChain.runtime.resolve('GameHub');

    // // @ts-expect-error
    // const dummieField: GameField = new GameField({
    //     cells: [...new Array(FIELD_SIZE)].map(
    //         (elem) => new GameCell({ value: UInt64.from(0) })
    //     ),
    // });

    // let cheatInput: GameInputs = new GameInputs({
    //     tiks: [...new Array(GAME_LENGTH)].map(
    //         (elem) => new Tick({ action: UInt64.from(0) })
    //     ),
    // }); // })[... new Array(FIELD_SIZE)].map(elem => )

    // cheatInput.tiks[1] = new Tick({ action: UInt64.from(1) });
    // cheatInput.tiks[2] = new Tick({ action: UInt64.from(2) });
    // cheatInput.tiks[3] = new Tick({ action: UInt64.from(1) });
    // cheatInput.tiks[4] = new Tick({ action: UInt64.from(0) });

    // const gameProof = await mockProof(
    //     checkGameRecord(dummieField, cheatInput)
    // );

    // const tx1 = await appChain.transaction(alice, () => {
    //     gameHub.addGameResult(alice, gameProof);
    // });

    // await tx1.sign();
    // await tx1.send();

    // const block = await appChain.produceBlock();

    // const lastSeed =
    //     (await appChain.query.runtime.GameHub.lastSeed.get()) ??
    //     UInt64.from(0);
    // console.log(lastSeed);

    // const gameRecordKey: GameRecordKey = new GameRecordKey({
    //     seed: lastSeed,
    //     player: alice,
    // });

    // console.log(gameRecordKey);

    // const userScore =
    //     await appChain.query.runtime.GameHub.gameRecords.get(gameRecordKey);

    // console.log(userScore?.toBigInt());
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-5">
      {
        address ?
          <div className="flex flex-col gap-5">
            {win && <div>You won! Ticks verification: <input type="text" value={JSON.stringify(ticks)} readOnly></input></div>}
            {lost && <div>You've lost! Nothing to prove</div>}

            <div className="flex flex-row gap-5 items-center justify-center">
              {win || lost ? (
                <div className='p-5 bg-slate-300 rounded-xl' onClick={() => startGame()}>Restart</div>
              ) : (
                <div className='p-5 bg-slate-300 rounded-xl' onClick={() => startGame()}>Start</div>
              )}
               {win && 
                <div className='p-5 bg-slate-300 rounded-xl' onClick={() => startGame()}>Send proof</div>
              }
            </div></div> :
          <div className='p-5 bg-slate-300 rounded-xl' onClick={() => connectWallet()}>Connect wallet</div>
      }
      <canvas id="canvas" width="500" height="500" ref={canvas}>
      </canvas>
    </main>
  );
}
