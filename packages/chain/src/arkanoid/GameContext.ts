import type { Field } from 'o1js';
import {
  UInt64,
  Struct,
  Provable,
  Int64,
  Bool,
  Poseidon,
  Experimental,
} from 'o1js';
import { RandomGenerator } from '../engine';
import {
  BRICK_HALF_WIDTH,
  DEFAULT_BALL_LOCATION_X,
  DEFAULT_BALL_LOCATION_Y,
  DEFAULT_BALL_SPEED_X,
  DEFAULT_BALL_SPEED_Y,
  DEFAULT_PLATFORM_SPEED,
  DEFAULT_PLATFORM_X,
  FIELD_HEIGHT,
  FIELD_PIXEL_HEIGHT,
  FIELD_PIXEL_WIDTH,
  FIELD_WIDTH,
  INITIAL_SCORE,
  MAX_BRICKS,
  MAX_BRICK_HEALTH,
  NEAREST_BRICKS_NUM,
  PLATFORM_WIDTH,
  SCORE_PER_TICKS,
  SEED_MULTIPLIER,
} from './constants';
import type { Tick } from './types';
import { Ball, Brick, Bricks, IntPoint, Platform } from './types';
import { gr, inRange } from './utility';

export class GameContext extends Struct({
  bricks: Bricks,
  nearestBricks: Provable.Array(Brick, NEAREST_BRICKS_NUM),
  totalLeft: UInt64,
  ball: Ball,
  platform: Platform,
  score: UInt64,
  winable: Bool,
  alreadyWon: Bool,
  debug: Bool,
}) {
  equals(other: GameContext): Bool {
    const bricksEquals = this.bricks.equals(other.bricks);
    let nearestBricksEquals = Bool(true);
    for (let i = 0; i < this.nearestBricks.length; i++) {
      nearestBricksEquals = nearestBricksEquals.and(
        this.nearestBricks[i].equals(other.nearestBricks[i]),
      );
    }
    const totalLeftEquals = this.totalLeft.equals(other.totalLeft);
    const ballEquals = this.ball.equals(other.ball);
    const platformEquals = this.platform.equals(other.platform);
    const scoreEquals = this.score.equals(other.score);
    const winableEquals = this.winable.equals(other.winable);
    const alreadyWonEquals = this.alreadyWon.equals(other.alreadyWon);
    const debugEquals = this.debug.equals(other.debug);

    return bricksEquals
      .and(nearestBricksEquals)
      .and(totalLeftEquals)
      .and(ballEquals)
      .and(platformEquals)
      .and(scoreEquals)
      .and(winableEquals)
      .and(alreadyWonEquals)
      .and(debugEquals);
  }

  processTick(tick: Tick): void {
    // 1) Update score
    this.score = Provable.if(
      this.alreadyWon,
      this.score,
      this.score.sub(SCORE_PER_TICKS),
    );

    /// 2) Update platform position
    const prevPlatformPosition = this.platform.position;
    inRange(Int64.from(tick.action), 0, FIELD_WIDTH);

    // Move sanity checks to separate function
    inRange(
      Int64.from(tick.action), // Overflow?
      -DEFAULT_PLATFORM_SPEED,
      DEFAULT_PLATFORM_SPEED,
    ).assertTrue();

    this.platform.position = this.platform.position.add(tick.action);

    const movedLeft = gr(prevPlatformPosition, this.platform.position);

    /// 3) Update ball position
    const prevBallPos = new IntPoint({
      x: this.ball.position.x,
      y: this.ball.position.y,
    });

    this.ball.move();

    /// 4) Check for edge bumps

    const leftBump = this.ball.position.x.isPositive().not();
    const rightBump = this.ball.position.x.sub(FIELD_PIXEL_WIDTH).isPositive();
    const bottomBump = this.ball.position.y
      .sub(FIELD_PIXEL_HEIGHT)
      .isPositive();
    const topBump = this.ball.position.y.isPositive().not();

    /// Add come constrains just in case

    // If bumf - just return it and change speed
    this.ball.position.x = Provable.if(
      leftBump,
      this.ball.position.x.neg(),
      this.ball.position.x,
    );

    this.ball.position.x = Provable.if(
      rightBump,
      Int64.from(2 * FIELD_PIXEL_WIDTH).sub(this.ball.position.x),
      this.ball.position.x,
    );

    this.ball.speed.x = Provable.if(
      leftBump.or(rightBump),
      this.ball.speed.x.neg(),
      this.ball.speed.x,
    );

    // let c = a.mul(this.ball.position.y).sub(b.mul(this.ball.position.x));

    /// 4') Update ball speed
    inRange(
      Int64.from(tick.momentum), // Overflow?
      -DEFAULT_PLATFORM_SPEED,
      DEFAULT_PLATFORM_SPEED,
    ).assertTrue();

    this.ball.speed.x = Provable.if(
      bottomBump,
      this.ball.speed.x.add(tick.momentum),
      this.ball.speed.x,
    );

    /// 5) Check platform bump

    /// #TODO: Think how to do it better.
    /// Extended is temporary solution. During tick platform is "extending" and fill
    /// all space between old position and new position. It helps to solve problem, when platform
    /// collision happen in the begining of the tick, and in the end of the tick platform located
    /// somwhere else, so contract count is as loss.

    const a = this.ball.speed.x;
    const b = this.ball.speed.y;

    const c = a.mul(this.ball.position.y).sub(b.mul(this.ball.position.x));

    const platformLeftEndExtended = Provable.if(
      movedLeft,
      this.platform.position,
      prevPlatformPosition,
    );
    const platformRightEndExtended = Provable.if(
      movedLeft,
      prevPlatformPosition.add(PLATFORM_WIDTH),
      this.platform.position.add(PLATFORM_WIDTH),
    );

    const adc0 = a.mul(FIELD_PIXEL_HEIGHT).sub(c);
    const platformLeft = b.mul(platformLeftEndExtended);
    const platformRight = b.mul(platformRightEndExtended);

    const isFail = bottomBump.and(
      inRange(adc0, platformLeft, platformRight).not(),
    );

    this.winable = this.winable.and(isFail.not());

    this.ball.position.y = Provable.if(
      bottomBump,
      Int64.from(2 * FIELD_PIXEL_HEIGHT).sub(this.ball.position.y),
      this.ball.position.y,
    );
    this.ball.position.y = Provable.if(
      topBump,
      this.ball.position.y.neg(),
      this.ball.position.y,
    );

    this.ball.speed.y = Provable.if(
      topBump.or(bottomBump),
      this.ball.speed.y.neg(),
      this.ball.speed.y,
    );

    // Update nearest bricks
    this.updateNearestBricks();

    //6) Check bricks bump
    for (let j = 0; j < NEAREST_BRICKS_NUM; j++) {
      const currentBrick = this.nearestBricks[j];
      const isAlive = currentBrick.value.greaterThan(UInt64.from(1)); // 1 just so UInt64.sub do not underflow

      const leftBorder = currentBrick.pos.x;
      const rightBorder = currentBrick.pos.x.add(BRICK_HALF_WIDTH * 2);
      const topBorder = currentBrick.pos.y.add(BRICK_HALF_WIDTH * 2);
      const bottomBorder = currentBrick.pos.y;

      /*
            Collision
                ball.pos.x \inc [leftBorder, rightBorder]
                ball.pos.y \inc [bottomBorder, topBorder]

            */

      const hasRightPass = inRange(
        rightBorder,
        prevBallPos.x,
        this.ball.position.x,
      );
      const hasLeftPass = inRange(
        leftBorder,
        prevBallPos.x,
        this.ball.position.x,
      );
      const hasTopPass = inRange(
        topBorder,
        prevBallPos.y,
        this.ball.position.y,
      );
      const hasBottomPass = inRange(
        bottomBorder,
        prevBallPos.y,
        this.ball.position.y,
      );

      /*
                Detect where collision ocured
                /////////////// horizontal part of a brick //////////////////////////
                y = d
                ay = bx + c;
                c = ay1 - bx1
                    a - ball.speed.x
                    b - ball.speed.y
                bx = ay - c
                bx = ad - c;

                x \incl [ brick.pos.x, brick.pos.x + 2 * BRICK_HALF_WIDTH ]
                bx \incl [b(brics.pos.x, b(brick.pos.x + 2 * BRICK_HALF_WIDTH))]
                ad - c \incl [b(brics.pos.x), b(brick.pos.x + 2 * BRICK_HALF_WIDTH))]
                


                /////////////// vertical part of a brick ////////////////////////////
                x = d
                ay = bx + c
                c = ay1 - bx1
                    a - ball.speed.x
                    b - ball.speed.y
                ay = bd + c

                y \incl [ brick.pos.y, brick.pos.y + 2 * BRICK_HALF_WIDTH]
                ay \incl [ a(brick.pos.y), a(brick.pos.y + 2 * BRICK_HALF_WIDTH)]
                bd + c \incl [ a(brick.pos.y), a(brick.pos.y + 2 * BRICK_HALF_WIDTH)]
            */

      const moveRight = this.ball.speed.x.isPositive();
      const moveTop = this.ball.speed.y.isPositive();

      const leftEnd = b.mul(currentBrick.pos.x);
      const rightEnd = b.mul(currentBrick.pos.x.add(2 * BRICK_HALF_WIDTH));

      // Top horizontal
      const d1 = topBorder;
      const adc1 = a.mul(d1).sub(c);
      const crossBrickTop = inRange(adc1, leftEnd, rightEnd);
      let hasTopBump = crossBrickTop.and(hasTopPass);

      // Bottom horisontal
      const d2 = bottomBorder;
      const adc2 = a.mul(d2).sub(c);
      const crossBrickBottom = inRange(adc2, leftEnd, rightEnd);
      let hasBottomBump = crossBrickBottom.and(hasBottomPass);

      const topEnd = a.mul(currentBrick.pos.y.add(2 * BRICK_HALF_WIDTH));
      const bottomEnd = a.mul(currentBrick.pos.y);

      // Left vertical
      const d3 = leftBorder;
      const bdc1 = b.mul(d3).add(c);
      const crossBrickLeft = inRange(bdc1, bottomEnd, topEnd);
      let hasLeftBump = crossBrickLeft.and(hasLeftPass);

      // Right vertical
      const d4 = rightBorder;
      const bdc2 = b.mul(d4).add(c);
      const crossBrickRight = inRange(bdc2, bottomEnd, topEnd);
      let hasRightBump = crossBrickRight.and(hasRightPass);

      /// Exclude double collision
      hasRightBump = Provable.if(
        moveRight,
        hasRightBump.and(hasTopBump.not()).and(hasBottomBump.not()),
        hasRightBump,
      );
      hasLeftBump = Provable.if(
        moveRight,
        hasLeftBump,
        hasLeftBump.and(hasTopBump.not()).and(hasBottomBump.not()),
      );
      hasTopBump = Provable.if(
        moveTop,
        hasTopBump.and(hasRightBump.not()).and(hasLeftBump.not()),
        hasTopBump,
      );
      hasBottomBump = Provable.if(
        moveTop,
        hasBottomBump,
        hasBottomBump.and(hasRightBump.not()).and(hasLeftBump.not()),
      );

      const collisionHappen = isAlive.and(
        hasRightBump.or(hasLeftBump).or(hasTopBump).or(hasBottomBump),
      );

      // Reduce health if coliision happend and brick is not dead

      const newBrickValue = Provable.if(
        collisionHappen,
        currentBrick.value.sub(1),
        currentBrick.value,
      );

      this.updateBrick(currentBrick.pos, newBrickValue);

      this.totalLeft = Provable.if(
        collisionHappen,
        this.totalLeft.sub(1),
        this.totalLeft,
      );

      this.alreadyWon = Provable.if(
        this.totalLeft.equals(UInt64.from(1)).and(this.winable),
        Bool(true),
        this.alreadyWon,
      );

      this.ball.speed.x = Provable.if(
        collisionHappen.and(hasLeftBump.or(hasRightBump)),
        this.ball.speed.x.neg(),
        this.ball.speed.x,
      );

      /*
                dx = x - leftBorder
                newX = leftBorder - (x - leftBorder) = 2leftBorder - x

                dx = rightBorder - x
                nexX = rightBorder + (rightBorder - x) = 2 rightBorder - x
            */

      // Update position on bump
      this.ball.position.x = Provable.if(
        collisionHappen.and(hasLeftBump),
        leftBorder.mul(2).sub(this.ball.position.x),
        this.ball.position.x,
      );

      this.ball.position.x = Provable.if(
        collisionHappen.and(hasRightBump),
        rightBorder.mul(2).sub(this.ball.position.x),
        this.ball.position.x,
      );

      this.ball.speed.y = Provable.if(
        collisionHappen.and(hasBottomBump.or(hasTopBump)),
        this.ball.speed.y.neg(),
        this.ball.speed.y,
      );

      this.ball.position.y = Provable.if(
        collisionHappen.and(hasTopBump),
        topBorder.mul(2).sub(this.ball.position.y),
        this.ball.position.y,
      );

      this.ball.position.y = Provable.if(
        collisionHappen.and(hasBottomBump),
        bottomBorder.mul(2).sub(this.ball.position.y),
        this.ball.position.y,
      );
    }

    Provable.asProver(() => {
      if (this.debug.toBoolean()) {
        console.log(
          `Ball position: <${this.ball.position.x} : ${this.ball.position.y}>`,
        );
        console.log(`Ball speed: ${this.ball.speed.x} : ${this.ball.speed.y}`);
      }
    });
  }

  // Is it provable? ...
  updateNearestBricks(): void {
    this.nearestBricks = this.bricks.bricks.slice(0, NEAREST_BRICKS_NUM); // Is it provable?
    let firstDist = this.distPow2ToBrick(this.bricks.bricks[0]);
    let secondDist = this.distPow2ToBrick(this.bricks.bricks[1]);

    // Chek order
    {
      const shouldSwap = gr(firstDist, secondDist);
      [firstDist, secondDist] = [
        Provable.if(shouldSwap, secondDist, firstDist),
        Provable.if(shouldSwap, firstDist, secondDist),
      ];
      [this.nearestBricks[0], this.nearestBricks[1]] = [
        Provable.if(
          shouldSwap,
          Brick,
          this.nearestBricks[1],
          this.nearestBricks[0],
        ) as Brick,
        Provable.if(
          shouldSwap,
          Brick,
          this.nearestBricks[0],
          this.nearestBricks[1],
        ) as Brick,
      ];
    }

    for (let i = 2; i < MAX_BRICKS; i++) {
      const cur = this.bricks.bricks[i];
      const curDist = this.distPow2ToBrick(cur);
      const secondGreater = gr(secondDist, curDist);
      const firstGreater = gr(firstDist, curDist);

      this.nearestBricks[1] = Provable.if(
        firstGreater,
        Brick,
        this.nearestBricks[0],
        Provable.if(secondGreater, Brick, cur, this.nearestBricks[1]),
      ) as Brick; // WTF

      secondDist = Provable.if(
        firstGreater,
        firstDist,
        Provable.if(secondGreater, curDist, secondDist),
      );

      this.nearestBricks[0] = Provable.if(
        firstGreater,
        Brick,
        cur,
        this.nearestBricks[0],
      ) as Brick;

      firstDist = Provable.if(firstGreater, curDist, firstDist);
    }
  }

  distPow2ToBrick(brick: Brick): Int64 {
    const xDist = brick.pos.x.sub(this.ball.position.x);
    const yDist = brick.pos.y.sub(this.ball.position.y);
    const realDist = xDist.mul(xDist).add(yDist.mul(yDist));

    /// Infinite dist for dead bricks
    const dist = Provable.if(
      brick.value.greaterThan(UInt64.from(1)),
      realDist,
      Int64.from(1000000000000), // Change to Int64.max
    );

    return dist;
  }

  updateBrick(pos: IntPoint, value: UInt64): void {
    for (let i = 0; i < MAX_BRICKS; i++) {
      this.bricks.bricks[i].value = Provable.if(
        pos.equals(this.bricks.bricks[i].pos),
        value,
        this.bricks.bricks[i].value,
      );
    }
  }
}
export function createBricksBySeed(seed: Field): Bricks {
  const generator = RandomGenerator.from(seed);

  const bricks = [...new Array(MAX_BRICKS)].map(
    (elem) =>
      new Brick({
        pos: new IntPoint({
          x: Int64.from(0),
          y: Int64.from(0),
        }),
        value: UInt64.from(1),
      }),
  );

  const rows = 2;
  const rowHeight = FIELD_HEIGHT / 2 / rows;
  const columns = MAX_BRICKS / rows;
  const columnWidth = FIELD_WIDTH / columns;

  for (let curRow = 0; curRow < rows; curRow++) {
    for (let curColumn = 0; curColumn < columns; curColumn++) {
      const brickId = curRow * columns + curColumn;
      const xPos = Int64.from(curColumn * columnWidth + 1);
      const yPos = Int64.from(curRow * rowHeight + 1);

      const [xDeviation, yDeviation, health] = generator.getNumbers([
        columnWidth - 2 * BRICK_HALF_WIDTH,
        rowHeight - 2 * BRICK_HALF_WIDTH,
        MAX_BRICK_HEALTH,
        1,
      ]);

      bricks[brickId].pos = new IntPoint({
        x: xPos.add(xDeviation),
        y: yPos.add(yDeviation),
      });
      bricks[brickId].value = health.magnitude.add(1);
    }
  }

  return new Bricks({ bricks });
}

export function loadGameContext(bricks: Bricks, debug: Bool) {
  const score = UInt64.from(INITIAL_SCORE);
  const ball = new Ball({
    position: IntPoint.from(DEFAULT_BALL_LOCATION_X, DEFAULT_BALL_LOCATION_Y),
    speed: IntPoint.from(DEFAULT_BALL_SPEED_X, DEFAULT_BALL_SPEED_Y),
  });
  const platform = new Platform({
    position: Int64.from(DEFAULT_PLATFORM_X),
  });

  let totalLeft = UInt64.from(1); // Again 1 == 0

  for (let i = 0; i < bricks.bricks.length; i++) {
    totalLeft = totalLeft.add(bricks.bricks[i].value.sub(1)); // Sub(1), because 1 = 0. (Workaround UInt64.sub(1))
  }

  const nearestBricks = bricks.bricks.slice(0, 2);

  return new GameContext({
    bricks,
    nearestBricks,
    totalLeft,
    ball,
    platform,
    score,
    winable: new Bool(true),
    alreadyWon: new Bool(false),
    debug,
  });
}
