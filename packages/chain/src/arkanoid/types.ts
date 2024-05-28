import {
  PublicKey,
  UInt64,
  Struct,
  Provable,
  Int64,
  Bool,
  CircuitString,
  Field,
} from 'o1js';
import {
  BRICK_HALF_WIDTH,
  CHUNK_LENGTH,
  GAME_LENGTH,
  MAX_BRICKS,
  PRECISION,
} from './constants';
import { inRange } from './utility';
import { UInt64 as ProtoUInt64 } from '@proto-kit/library';

export class GameRecordKey extends Struct({
  competitionId: UInt64,
  player: PublicKey,
}) {}

export class Competition extends Struct({
  name: CircuitString,
  // description: CircuitString,
  seed: Field,
  prereg: Bool,
  preregStartTime: ProtoUInt64,
  preregEndTime: ProtoUInt64,
  competitionStartTime: ProtoUInt64,
  competitionEndTime: ProtoUInt64,
  funds: ProtoUInt64,
  participationFee: ProtoUInt64,
}) {
  static from(
    name: string,
    // description: string,
    seed: string,
    prereg: boolean,
    preregStartTime: number,
    preregEndTime: number,
    competitionStartTime: number,
    competitionEndTime: number,
    funds: number,
    participationFee: number,
  ): Competition {
    return new Competition({
      name: CircuitString.fromString(name),
      // description: CircuitString.fromString(description),
      seed: CircuitString.fromString(seed).hash(),
      prereg: new Bool(prereg),
      preregStartTime: ProtoUInt64.from(preregStartTime),
      preregEndTime: ProtoUInt64.from(preregEndTime),
      competitionStartTime: ProtoUInt64.from(competitionStartTime),
      competitionEndTime: ProtoUInt64.from(competitionEndTime),
      funds: ProtoUInt64.from(funds).mul(10 ** 9),
      participationFee: ProtoUInt64.from(participationFee).mul(10 ** 9),
    });
  }
}

export class LeaderboardIndex extends Struct({
  competitionId: UInt64,
  index: UInt64,
}) {}

export class LeaderboardScore extends Struct({
  score: UInt64,
  player: PublicKey,
}) {}

export class Point extends Struct({
  x: UInt64,
  y: UInt64,
}) {
  static from(_x: number, _y: number): Point {
    return new Point({
      x: UInt64.from(_x),
      y: UInt64.from(_y),
    });
  }

  add(p: Point): Point {
    return new Point({
      x: this.x.add(p.x),
      y: this.y.add(p.y),
    });
  }
}

export class Tick extends Struct({
  action: Int64,
  momentum: Int64,
}) {}

export class GameInputs extends Struct({
  ticks: Provable.Array(Tick, CHUNK_LENGTH),
}) {}

/////////////////////////////////// Game logic structs //////////////////////////////////

export class IntPoint extends Struct({
  x: Int64,
  y: Int64,
}) {
  static from(_x: number, _y: number): IntPoint {
    return new IntPoint({
      x: Int64.from(_x),
      y: Int64.from(_y),
    });
  }

  equals(b: IntPoint): Bool {
    return this.x.equals(b.x).and(this.y.equals(b.y));
  }

  mulByPoint(p: IntPoint): IntPoint {
    return new IntPoint({
      x: this.x.mul(p.x),
      y: this.y.mul(p.y),
    });
  }
}

export class Brick extends Struct({
  pos: IntPoint, //
  value: UInt64,
}) {
  equals(other: Brick): Bool {
    return this.pos.equals(other.pos).and(this.value.equals(other.value));
  }
}

export class Bricks extends Struct({
  bricks: Provable.Array(Brick, MAX_BRICKS),
}) {
  static empty(): Bricks {
    return new Bricks({
      bricks: [...new Array(MAX_BRICKS)].map(
        (elem) =>
          new Brick({
            pos: new IntPoint({
              x: Int64.from(0),
              y: Int64.from(0),
            }),
            value: UInt64.from(1),
          }),
      ),
    });
  }
  equals(other: Bricks): Bool {
    let result = Bool(true);

    for (let i = 0; i < this.bricks.length; i++) {
      result = result.and(this.bricks[i].equals(other.bricks[i]));
    }

    return result;
  }
}

export class Ball extends Struct({
  position: IntPoint,
  speed: IntPoint,
}) {
  equals(other: Ball): Bool {
    return this.position
      .equals(other.position)
      .and(this.speed.equals(other.speed));
  }

  movePortion(portion: UInt64): void {
    this.position.x = this.position.x.add(
      this.speed.x.mul(portion).div(PRECISION),
    );
    this.position.y = this.position.y.add(
      this.speed.y.mul(portion).div(PRECISION),
    );
  }

  move(): void {
    this.position.x = this.position.x.add(this.speed.x);
    this.position.y = this.position.y.add(this.speed.y);
  }

  checkBrickCollision(prevBallPos: IntPoint, brick: Brick): Collision {
    const a = this.speed.x;
    const b = this.speed.y;
    const c = a.mul(this.position.y).sub(b.mul(this.position.x));

    const isAlive = brick.value.greaterThan(UInt64.from(1)); // 1 just so UInt64.sub do not underflow

    const leftBorder = brick.pos.x;
    const rightBorder = brick.pos.x.add(BRICK_HALF_WIDTH * 2);
    const topBorder = brick.pos.y.add(BRICK_HALF_WIDTH * 2);
    const bottomBorder = brick.pos.y;

    /*
            Collision
                ball.pos.x \inc [leftBorder, rightBorder]
                ball.pos.y \inc [bottomBorder, topBorder]

            */

    const hasRightPass = inRange(rightBorder, prevBallPos.x, this.position.x);
    const hasLeftPass = inRange(leftBorder, prevBallPos.x, this.position.x);
    const hasTopPass = inRange(topBorder, prevBallPos.y, this.position.y);
    const hasBottomPass = inRange(bottomBorder, prevBallPos.y, this.position.y);

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

    const moveRight = this.speed.x.isPositive();
    const moveTop = this.speed.y.isPositive();

    const leftEnd = b.mul(brick.pos.x);
    const rightEnd = b.mul(brick.pos.x.add(2 * BRICK_HALF_WIDTH));

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

    const topEnd = a.mul(brick.pos.y.add(2 * BRICK_HALF_WIDTH));
    const bottomEnd = a.mul(brick.pos.y);

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

    let speedModifier = IntPoint.from(1, 1);
    speedModifier.x = Provable.if(
      hasRightBump.or(hasLeftBump),
      Int64.from(-1),
      Int64.from(1),
    );
    speedModifier.y = Provable.if(
      hasTopBump.or(hasBottomBump),
      Int64.from(-1),
      Int64.from(1),
    );

    let time = UInt64.from(PRECISION * 1000);

    time = Provable.if(
      hasLeftBump,
      leftBorder
        .sub(prevBallPos.x)
        .magnitude.mul(PRECISION)
        .div(this.speed.x.magnitude),
      time,
    );
    time = Provable.if(
      hasRightBump,
      prevBallPos.x
        .sub(rightBorder)
        .magnitude.mul(PRECISION)
        .div(this.speed.x.magnitude),
      time,
    );
    time = Provable.if(
      hasTopBump,
      prevBallPos.y
        .sub(topBorder)
        .magnitude.mul(PRECISION)
        .div(this.speed.y.magnitude),
      time,
    );
    time = Provable.if(
      hasBottomBump,
      bottomBorder
        .sub(prevBallPos.y)
        .magnitude.mul(PRECISION)
        .div(this.speed.y.magnitude),
      time,
    );

    // If brick is destroyed - set collision time to insinite
    time = Provable.if(isAlive, time, UInt64.from(PRECISION * 1000));

    // Do not account collisions in zero time
    time = Provable.if(
      time.equals(UInt64.zero),
      UInt64.from(PRECISION * 1000),
      time,
    );

    let position = IntPoint.from(0, 0);
    position.x = prevBallPos.x.add(this.speed.x.mul(time).div(PRECISION));
    position.y = prevBallPos.y.add(this.speed.y.mul(time).div(PRECISION));

    return new Collision({
      time,
      target: brick,
      position,
      speedModifier,
    });

    // Reduce health if coliision happend and brick is not dead

    //   const newBrickValue = Provable.if(
    //     collisionHappen,
    //     currentBrick.value.sub(1),
    //     currentBrick.value,
    //   );

    //   this.updateBrick(currentBrick.pos, newBrickValue);

    //   this.totalLeft = Provable.if(
    //     collisionHappen,
    //     this.totalLeft.sub(1),
    //     this.totalLeft,
    //   );

    //   this.alreadyWon = Provable.if(
    //     this.totalLeft.equals(UInt64.from(1)).and(this.winable),
    //     Bool(true),
    //     this.alreadyWon,
    //   );

    //   this.ball.speed.x = Provable.if(
    //     collisionHappen.and(hasLeftBump.or(hasRightBump)),
    //     this.ball.speed.x.neg(),
    //     this.ball.speed.x,
    //   );

    //   /*
    //             dx = x - leftBorder
    //             newX = leftBorder - (x - leftBorder) = 2leftBorder - x

    //             dx = rightBorder - x
    //             nexX = rightBorder + (rightBorder - x) = 2 rightBorder - x
    //         */

    //   // Update position on bump
    //   this.ball.position.x = Provable.if(
    //     collisionHappen.and(hasLeftBump),
    //     leftBorder.mul(2).sub(this.ball.position.x),
    //     this.ball.position.x,
    //   );

    //   this.ball.position.x = Provable.if(
    //     collisionHappen.and(hasRightBump),
    //     rightBorder.mul(2).sub(this.ball.position.x),
    //     this.ball.position.x,
    //   );

    //   this.ball.speed.y = Provable.if(
    //     collisionHappen.and(hasBottomBump.or(hasTopBump)),
    //     this.ball.speed.y.neg(),
    //     this.ball.speed.y,
    //   );

    //   this.ball.position.y = Provable.if(
    //     collisionHappen.and(hasTopBump),
    //     topBorder.mul(2).sub(this.ball.position.y),
    //     this.ball.position.y,
    //   );

    //   this.ball.position.y = Provable.if(
    //     collisionHappen.and(hasBottomBump),
    //     bottomBorder.mul(2).sub(this.ball.position.y),
    //     this.ball.position.y,
    //   );
    // }
  }
}

export class Collision extends Struct({
  time: UInt64,
  target: Brick,
  position: IntPoint,
  speedModifier: IntPoint,
}) {
  earlierThan(c: Collision): Bool {
    return this.time.lessThan(c.time);
  }
}

export class Platform extends Struct({
  position: Int64,
}) {
  equals(other: Platform): Bool {
    return this.position.equals(other.position);
  }
}
