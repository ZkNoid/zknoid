'use client';
import {
  Brick,
  Bricks,
  Tick,
  loadGameContext,
  BRICK_HALF_WIDTH,
  MAX_BRICKS,
  FIELD_HEIGHT,
  FIELD_WIDTH,
  DEFAULT_BALL_LOCATION_X,
  DEFAULT_BALL_LOCATION_Y,
  TICK_PERIOD,
  DEFAULT_BALL_SPEED_X,
  DEFAULT_BALL_SPEED_Y,
  IntPoint,
  DEFAULT_PLATFORM_SPEED,
  GameContext,
  ACCELERATION,
} from 'zknoid-chain-dev';
import { useEffect, useRef, useState } from 'react';
import { Int64, UInt64, Bool } from 'o1js';
import { Ball, Cart, IBrick } from '@/lib/types';
import { PLATFORM_WIDTH } from 'zknoid-chain-dev/dist/src/arkanoid/constants';

export interface ITick {
  action: number;
  momentum: number;
}

interface IGameViewProps {
  gameId: number;
  onWin: (ticks: ITick[]) => void;
  onRestart: (ticks: ITick[]) => void;
  onLost: (ticks: ITick[]) => void;
  setScore: (score: number) => void;
  setTicksAmount: (ticksAmount: number) => void;
  level: Bricks;
  debug: boolean;
}

interface IContractBrick {
  pos: IntPoint;
  value: UInt64;
}

interface IContractBrickPorted {
  x: number;
  y: number;
  w: number;
  h: number;
  value: number;
}

export const GameView = (props: IGameViewProps) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ctx, setContext] = useState<
    CanvasRenderingContext2D | null | undefined
  >(null);
  const [win, setWin] = useState(false);
  const [lost, setLost] = useState(false);
  const paused = useRef(false);

  let [winable, setWinable] = useState(true);

  let ticksCache: ITick[] = [];
  let bricksLeft: number = 0;

  let brickImages: HTMLImageElement[] = [new Image(), new Image(), new Image()];
  brickImages[0].src = '/sprite/brick/1.png';
  brickImages[1].src = '/sprite/brick/2.png';
  brickImages[2].src = '/sprite/brick/3.png';

  let crack1Images: HTMLImageElement[] = [
    new Image(),
    new Image(),
    new Image(),
  ];
  crack1Images[0].src = '/sprite/brick/1_crack1.png';
  crack1Images[1].src = '/sprite/brick/2_crack1.png';
  crack1Images[2].src = '/sprite/brick/3_crack1.png';

  let crack2Images: HTMLImageElement[] = [
    new Image(),
    new Image(),
    new Image(),
  ];
  crack2Images[0].src = '/sprite/brick/1_crack2.png';
  crack2Images[1].src = '/sprite/brick/2_crack2.png';
  crack2Images[2].src = '/sprite/brick/3_crack2.png';

  let cartImage = new Image();
  cartImage.src = '/sprite/cart.png';

  let ballImage = new Image();
  ballImage.src = '/sprite/ball.png';

  // const [ticks, setTicks] = useState<number[]>([]);

  let lastUpdateTime = Date.now();
  const tickPeriod = TICK_PERIOD;

  let gameContext: GameContext; // For updating contractBall position

  let ball: Ball;
  let contractBall: Ball;
  let cart: Cart;
  let prevCartPos: number;
  let contractCart: Cart;
  let bricks: IBrick[] = [];
  let contractBricks: IBrick[] = [];
  let initialBrickValues: number[] = [];
  let contractNearestBricks: IBrick[] = [];
  let stopped: boolean = false;
  const debugMode = props.debug;

  const debugModeRef = useRef(debugMode);

  let ballTrace: [number, number][] = [];
  let contractBallTrace: [number, number][] = [];

  useEffect(() => {
    const ctx = canvas!.current?.getContext('2d');
    console.log('Setting canvas', ctx);
    setContext(ctx);

    if (ctx) {
      const handleResize = () => {
        ctx.canvas.height = ctx.canvas.clientHeight + 10;
        ctx.canvas.width = ctx.canvas.clientWidth;
      };

      handleResize();
      window.addEventListener('resize', handleResize);

      return () => window.removeEventListener('resize', handleResize);
    }
  }, [canvas]);

  useEffect(() => {
    console.log('Setting game', ctx);
    if (props.gameId > 0 && ctx) startGame();
  }, [props.gameId, ctx]);

  useEffect(() => {
    debugModeRef.current = debugMode;
  }, [debugMode]);

  let lastTime: number | undefined;

  const gameLoop = (time: number) => {
    if (stopped) return;

    if (paused.current) {
      lastTime = time;
      requestAnimationFrame(gameLoop);
      return;
    }

    if (lastTime === undefined) lastTime = time;

    let elapsed = time - lastTime;

    lastTime = time;

    ctx!.clearRect(0, 0, canvas.current!.width, canvas.current!.height);

    let overhead = Date.now() - lastUpdateTime - tickPeriod;
    if (overhead >= 0) {
      pushTick(Math.round(cart.x - prevCartPos), cart.hitMomentum);
      prevCartPos = cart.x;
      // ticksCache.push(1);
      // setTicks([...ticksCache, 1]);
      elapsed = overhead;
      lastUpdateTime = Date.now() - overhead;
    }

    moveCart(elapsed);
    moveBall(elapsed);

    drawBall();
    drawBricks();

    drawCart();

    if (debugModeRef.current) {
      drawContractBall();
      drawContractBricks();
      // drawContractNearestBricks();
      drawContractCart();
      drawBallsTraces();
    }

    requestAnimationFrame(gameLoop);
  };

  const moveCart = (elapsed: number) => {
    cart.dx += (cart.ddx * elapsed) / TICK_PERIOD;
    if (cart.dx > 0) {
      cart.dx = Math.min(cart.dx, DEFAULT_PLATFORM_SPEED);
    } else {
      cart.dx = Math.max(cart.dx, -DEFAULT_PLATFORM_SPEED);
    }
    cart.x += (cart.dx * elapsed) / TICK_PERIOD;

    if (cart.x > FIELD_WIDTH - cart.w) {
      cart.x = FIELD_WIDTH - cart.w;
    }

    if (cart.x < 0) {
      cart.x = 0;
    }
  };

  const moveBall = (elapsed: number) => {
    ball.x += (ball.dx * elapsed) / TICK_PERIOD;
    ball.y += (ball.dy * elapsed) / TICK_PERIOD;

    const leftBump = ball.x - ball.radius < 0;
    const rightBump = ball.x - FIELD_WIDTH > 0;
    const topBump = ball.y < 0;
    let bottomBump = ball.y - FIELD_HEIGHT > 0; // Undo bump if hiy cart

    if (leftBump) {
      ball.x *= -1;
    }

    if (rightBump) {
      ball.x = FIELD_WIDTH - (ball.x - FIELD_WIDTH);
    }

    if (rightBump) {
      ball.x = FIELD_WIDTH - (ball.x - FIELD_WIDTH);
    }

    if (leftBump || rightBump) {
      ball.dx *= -1;
    }

    if (topBump) {
      ball.y *= 1;
      ball.dy *= -1;
    }

    // if (ball.x >= cart.x && ball.x <= cart.x + cart.w && ball.y >= cart.y) {
    if (bottomBump) {
      ball.y = 2 * cart.y - ball.y;
      ball.dy *= -1;
      cart.hitMomentum = Math.round(cart.dx / 10);
      ball.dx += cart.hitMomentum;
      bottomBump = false;
    }

    // if (bottomBump) {
    //   return onLost();
    // }

    ballTrace.push([ball.x, ball.y]);

    const bricksNum = gameContext.bricks.bricks
      .map((brick: IContractBrick) => {
        return {
          value: +brick.value.toString(),
        } as IContractBrickPorted;
      })
      .filter((brick: IContractBrickPorted) => brick.value > 1).length;

    if (bricksNum == 0) {
      stopped = true;
      return onWin();
    }

    bricks.forEach((brick) => {
      if (brick.value > 1) {
        if (
          ball.x > brick.x &&
          ball.x < brick.x + brick.w &&
          ball.y > brick.y &&
          ball.y < brick.y + brick.h
        ) {
          let leftBorder = brick.x;
          let rightBorder = brick.x + brick.w;
          let topBorder = brick.y;
          let bottomBorder = brick.y + brick.h;

          let leftBorderDist = Math.abs(ball.x - leftBorder);
          let rightBorderDist = Math.abs(ball.x - rightBorder);
          let topBorderDist = Math.abs(ball.y - topBorder);
          let bottomBorderDist = Math.abs(ball.y - bottomBorder);

          let minVerticalDist = Math.min(topBorderDist, bottomBorderDist);
          let minHorizontalDist = Math.min(leftBorderDist, rightBorderDist);

          if (minHorizontalDist < minVerticalDist) {
            if (leftBorderDist < rightBorderDist) {
              ball.x = 2 * leftBorder - ball.x;
            } else {
              ball.x = 2 * rightBorder - ball.x;
            }
            ball.dx *= -1;
          } else {
            if (topBorderDist < bottomBorderDist) {
              ball.y = 2 * topBorder - ball.y;
            } else {
              ball.y = 2 * bottomBorder - ball.y;
            }
            ball.dy *= -1;
          }

          brick.value -= 1;
          if (brick.value == 1) {
            bricksLeft -= 1;
          }
        }
      }
    });
  };

  const drawBall = () => {
    ctx!.beginPath();
    ctx!.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx!.fillStyle = 'black';
    // ctx!.fill();
    ctx?.drawImage(
      ballImage,
      resizeToConvasSize(ball.x - ball.radius),
      resizeToConvasSize(ball.y - ball.radius),
      resizeToConvasSize(ball.radius * 2),
      resizeToConvasSize(ball.radius * 2)
    );
    ctx!.closePath();
  };

  const drawContractBall = () => {
    ctx!.beginPath();
    ctx!.arc(
      resizeToConvasSize(contractBall.x),
      resizeToConvasSize(contractBall.y),
      resizeToConvasSize(contractBall.radius),
      0,
      Math.PI * 2
    );
    ctx!.strokeStyle = 'red';
    ctx!.stroke();
    ctx!.closePath();
  };

  const drawBricks = () => {
    bricks.forEach((brick, i) => {
      if (brick.value > 1) {
        const dValue = initialBrickValues[i] - brick.value;
        const brickType = initialBrickValues[i] - 2;
        const brickImage =
          dValue == 0
            ? brickImages[brickType]
            : dValue == 1
              ? crack1Images[brickType]
              : crack2Images[brickType];
        ctx!.drawImage(
          brickImage,
          resizeToConvasSize(brick.x),
          resizeToConvasSize(brick.y),
          resizeToConvasSize(brick.w),
          resizeToConvasSize(brick.h)
        );
      }
    });
  };

  const drawContractBricks = () => {
    ctx!.strokeStyle = '#4DC7D7';
    ctx!.setLineDash([5, 5]);

    contractBricks
      .filter((brick: IContractBrickPorted) => brick.value > 1)
      .forEach((brick) => {
        ctx!.beginPath();
        ctx!.rect(
          resizeToConvasSize(brick.x),
          resizeToConvasSize(brick.y),
          resizeToConvasSize(brick.w),
          resizeToConvasSize(brick.h)
        );
        ctx!.stroke();
        ctx!.closePath();
      });
    ctx!.setLineDash([]);
  };

  const drawContractNearestBricks = () => {
    ctx!.strokeStyle = 'orange';
    ctx!.setLineDash([]);

    contractNearestBricks.forEach((brick) => {
      ctx!.beginPath();
      ctx!.rect(
        resizeToConvasSize(brick.x),
        resizeToConvasSize(brick.y),
        resizeToConvasSize(brick.w),
        resizeToConvasSize(brick.h)
      );
      ctx!.stroke();
      ctx!.closePath();
    });
    ctx!.setLineDash([]);
  };

  const drawCart = () => {
    // ctx!.beginPath();
    // ctx!.rect(cart.x, cart.y, cart.w, cart.h);
    // ctx!.fillStyle = 'red';
    // // ctx!.fill();
    // ctx!.closePath();

    ctx?.drawImage(
      cartImage,
      resizeToConvasSize(cart.x),
      resizeToConvasSize(cart.y),
      resizeToConvasSize(cart.w),
      resizeToConvasSize(cart.h)
    );
  };

  const drawContractCart = () => {
    ctx!.setLineDash([5, 5]);
    ctx!.beginPath();
    ctx!.rect(
      resizeToConvasSize(contractCart.x),
      resizeToConvasSize(contractCart.y),
      resizeToConvasSize(contractCart.w),
      resizeToConvasSize(contractCart.h)
    );
    ctx!.strokeStyle = 'green';
    ctx!.stroke();
    ctx!.closePath();
    ctx!.setLineDash([]);
  };

  const drawBallsTraces = () => {
    const prevLineWidth = ctx!.lineWidth;
    ctx!.lineWidth = 0.3;
    ctx!.setLineDash([5, 5]);

    // Ball trace
    ctx!.beginPath();
    ctx!.strokeStyle = '#D2FF00';
    if (ballTrace.length > 0) {
      ctx!.moveTo(
        resizeToConvasSize(ballTrace[0][0]),
        resizeToConvasSize(ballTrace[0][1])
      );
    }
    for (const point of ballTrace.slice(1)) {
      ctx!.lineTo(resizeToConvasSize(point[0]), resizeToConvasSize(point[1]));
    }
    ctx!.stroke();
    ctx!.closePath();

    // Contract ball trace line
    ctx!.beginPath();
    ctx!.strokeStyle = '#4DC7D7';
    if (contractBallTrace.length > 0) {
      ctx!.moveTo(
        resizeToConvasSize(contractBallTrace[0][0]),
        resizeToConvasSize(contractBallTrace[0][1])
      );
    }
    for (const point of contractBallTrace) {
      ctx!.lineTo(resizeToConvasSize(point[0]), resizeToConvasSize(point[1]));
    }
    ctx!.stroke();
    ctx!.closePath();

    // // Contract ball position trace
    // for (const point of contractBallTrace) {
    //   ctx!.beginPath();
    //   ctx!.arc(point[0], point[1], 3, 0, Math.PI * 2);
    //   ctx!.fill();
    //   ctx!.closePath();
    // }

    ctx!.lineWidth = prevLineWidth;
    ctx!.setLineDash([]);
  };

  const resizeToConvasSize = (x: number) => {
    return (x * (canvas.current?.width || FIELD_WIDTH)) / FIELD_WIDTH;
  };

  const keyDown = (e: KeyboardEvent) => {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      // if (
      //   Date.now() - lastUpdateTime >
      //   tickPeriod
      //   // ticksCache[ticksCache.length - 1] != 2
      // ) {
      //   // pushTick(DEFAULT_PLATFORM_SPEED);
      //   // ticksCache.push(2);
      //   //   setTicks([...ticksCache, 2]);
      //   lastUpdateTime = Date.now();
      // }

      cart.ddx = ACCELERATION;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      // if (
      //   Date.now() - lastUpdateTime >
      //   tickPeriod
      //   // ticksCache[ticksCache.length - 1] != 0
      // ) {
      //   // pushTick(-DEFAULT_PLATFORM_SPEED);
      //   // ticksCache.push(0);
      //   //   setTicks([...ticksCache, 0]);
      //   lastUpdateTime = Date.now();
      // }

      cart.ddx = -ACCELERATION;
    }

    if (e.key.toLowerCase() === 'r') {
      // #TODO restarts. Now starts to freeze after several restarts
      // onRestart();
    }

    if (e.key.toLowerCase() === 'p') {
      console.log('Paused');
      paused.current = !paused.current;
    }
  };

  const keyUp = (e: KeyboardEvent) => {
    if (
      e.key === 'Right' ||
      e.key === 'ArrowRight' ||
      e.key === 'Left' ||
      e.key === 'ArrowLeft'
    ) {
      cart.ddx = 0;
      cart.dx = 0;
    }
  };

  const startGame = () => {
    setWinable(true);
    setLost(false);
    setWin(false);
    lastTime = undefined;
    stopped = false;
    bricksLeft = props.level.bricks.length;

    ball = {
      x: DEFAULT_BALL_LOCATION_X,
      y: DEFAULT_BALL_LOCATION_Y,
      dx: DEFAULT_BALL_SPEED_X,
      dy: DEFAULT_BALL_SPEED_Y,
      radius: 3,
    };

    console.log(ball);

    cart = {
      x: FIELD_WIDTH / 2,
      y: FIELD_HEIGHT,
      w: PLATFORM_WIDTH,
      h: 10,
      dx: 0,
      ddx: 0,
      hitMomentum: 0,
    };
    prevCartPos = cart.x;

    const commonBrick = {
      w: BRICK_HALF_WIDTH * 2,
      h: BRICK_HALF_WIDTH * 2,
      gap: 20,
    };

    for (let i = 0; i < bricks.length; i++) {}

    console.log('Level bricks', props.level.bricks);

    for (let i = 0; i < props.level.bricks.length; i++) {
      const brickValue = Number(props.level.bricks[i].value.toBigInt());
      bricks[i] = {
        x: (props.level.bricks[i].pos.x as any) * 1,
        y: (props.level.bricks[i].pos.y as any) * 1,
        value: brickValue,
        ...commonBrick,
      };
      initialBrickValues[i] = brickValue;
    }

    console.log(' bricks', bricks);

    /// Contract context init
    //@ts-ignore
    const contractBricks: Bricks = new Bricks({
      bricks: [...new Array(MAX_BRICKS)].map(
        (elem) =>
          //@ts-ignore
          new Brick({
            //@ts-ignore
            pos: new IntPoint({
              x: Int64.from(0),
              y: Int64.from(0),
            }),
            value: UInt64.from(1),
          })
      ),
    });

    for (let i = 0; i < Math.min(props.level.bricks.length, MAX_BRICKS); i++) {
      //@ts-ignore
      contractBricks.bricks[i] = new Brick({
        //@ts-ignore
        pos: new IntPoint({
          x: Int64.from(bricks[i].x),
          y: Int64.from(bricks[i].y),
        }),
        value: UInt64.from(bricks[i].value),
      });
    }

    gameContext = loadGameContext(contractBricks, new Bool(false));
    contractBall = {
      x: (gameContext.ball.position.x as any) * 1,
      y: (gameContext.ball.position.y as any) * 1,
      dx: 0,
      dy: 0,
      radius: 3,
    };

    contractCart = {
      ...cart,
      x: (gameContext.platform.position as any) * 1,
    };

    if (
      ball.x - ball.radius > cart.x &&
      ball.x + ball.radius < cart.x + cart.w &&
      ball.y + ball.radius > cart.y
    ) {
      ball.dy = -ball.dy;
    }

    requestAnimationFrame(gameLoop);

    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);
  };
  const onWin = async () => {
    stopped = true;

    props.onWin(ticksCache);
    return;
  };

  const onRestart = async () => {
    stopped = true;
    props.onRestart(ticksCache);
  };

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
  };

  const getCollisionPoint = (
    prevPos: [number, number],
    newPos: [number, number],
    prevSpeed: [number, number],
    newSpeed: [number, number]
  ): [number, number] => {
    // ay = bx + d
    let a1 = prevSpeed[0];
    let b1 = prevSpeed[1];

    let d1 = a1 * prevPos[1] - b1 * prevPos[0];
    let a2 = newSpeed[0];
    let b2 = newSpeed[1];
    let d2 = a2 * newPos[1] - b2 * newPos[0];

    // a1y = b1x + d1 => y = (b1x + d1)/a1
    // a2y = b2x + d2 => y = (b2x + d2)/a2
    // a2b1x + a2d1 = a1b2x + a1d2 => x(a2b1 - a1b2) = a1d2 - a2d1
    // x = (a1d2 - a2d1) / (a2b1 - a1b2)

    let x = (a1 * d2 - a2 * d1) / (a2 * b1 - a1 * b2);
    let y = (b1 * x + d1) / a1;

    return [x, y];
  };

  const sync = () => {
    ball.x = contractBall.x;
    ball.y = contractBall.y;
    ball.dx = contractBall.dx;
    ball.dy = contractBall.dy;

    cart.x = contractCart.x;

    bricks = contractBricks;
  };

  //  #TODO: refactor
  const pushTick = (action: number, momentum: number) => {
    action = Math.min(action, DEFAULT_PLATFORM_SPEED);
    action = Math.max(action, -DEFAULT_PLATFORM_SPEED);
    ticksCache.push({ action, momentum });

    let prevPos: [number, number] =
      contractBallTrace.length > 0
        ? contractBallTrace[contractBallTrace.length - 1]
        : [
            (gameContext.ball.position.x as any) * 1,
            (gameContext.ball.position.y as any) * 1,
          ];

    let prevSpeed: [number, number] = [
      (gameContext.ball.speed.x as any) * 1,
      (gameContext.ball.speed.y as any) * 1,
    ];

    gameContext.processTick(
      //@ts-ignore
      new Tick({
        action: Int64.from(action),
        momentum: Int64.from(momentum),
      })
    );
    let [x, y] = [
      (gameContext.ball.position.x as any) * 1,
      (gameContext.ball.position.y as any) * 1,
    ];

    contractBall.x = x;
    contractBall.y = y;
    contractBall.dx = (gameContext.ball.speed.x as any) * 1;
    contractBall.dy = (gameContext.ball.speed.y as any) * 1;
    contractBallTrace = [];

    if (debugModeRef.current) {
      let newSpeed: [number, number] = [
        (gameContext.ball.speed.x as any) * 1,
        (gameContext.ball.speed.y as any) * 1,
      ];

      // Should add additional point to points, because collision point is ommited
      // #TODO: Change calculation for brick collision. For now works only with border collisions, but works bad for brick collision.
      if (prevSpeed[0] == -newSpeed[0] || prevSpeed[1] == -newSpeed[1]) {
        contractBallTrace.push(
          getCollisionPoint(prevPos, [x, y], prevSpeed, newSpeed)
        );
      }

      contractBallTrace.push([x, y]);
    }

    const contractBrickToBrick = (brick: IContractBrick) => {
      let x = (brick.pos.x as any) * 1;
      let y = (brick.pos.y as any) * 1;
      return {
        x,
        y,
        w: 2 * BRICK_HALF_WIDTH,
        h: 2 * BRICK_HALF_WIDTH,
        value: +brick.value.toString(),
      } as IContractBrickPorted;
    };

    contractBricks = gameContext.bricks.bricks.map(contractBrickToBrick);
    // .filter((brick: IContractBrickPorted) => brick.value > 1);

    contractNearestBricks = gameContext.nearestBricks.map(contractBrickToBrick);

    contractCart = {
      ...cart,
      x: (gameContext.platform.position as any) * 1,
    };

    props.setTicksAmount(ticksCache.length);
    props.setScore((gameContext.score as any) * 1);
    if (!gameContext.winable.toBoolean()) {
      setWinable(false);
      onLost();
    }

    sync();
  };

  return (
    <canvas
      id="canvas"
      // width={`${FIELD_WIDTH}`}
      // height={`${FIELD_HEIGHT + 10}`}
      ref={canvas}
      className={`aspect-square w-full rounded-[5px] lg:rounded-none ${
        winable ? 'border border-[#D2FF00]' : 'border border-red-500'
      }`}
    ></canvas>
  );
};
