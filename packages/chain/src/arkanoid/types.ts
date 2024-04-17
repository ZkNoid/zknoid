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
import { CHUNK_LENGTH, GAME_LENGTH, MAX_BRICKS } from './constants';

export class GameRecordKey extends Struct({
  competitionId: UInt64,
  player: PublicKey,
}) {}

export class Competition extends Struct({
  name: CircuitString,
  // description: CircuitString,
  seed: Field,
  prereg: Bool,
  preregStartTime: UInt64,
  preregEndTime: UInt64,
  competitionStartTime: UInt64,
  competitionEndTime: UInt64,
  funds: UInt64,
  participationFee: UInt64,
}) {
  static from(
    name: string,
    // description: string,
    seed: number,
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
      seed: Field.from(seed),
      prereg: new Bool(prereg),
      preregStartTime: UInt64.from(preregStartTime),
      preregEndTime: UInt64.from(preregEndTime),
      competitionStartTime: UInt64.from(competitionStartTime),
      competitionEndTime: UInt64.from(competitionEndTime),
      funds: UInt64.from(funds).mul(10 ** 9),
      participationFee: UInt64.from(participationFee).mul(10 ** 9),
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
    this.position.x = this.position.x.add(this.speed.x.mul(portion).div(100));
    this.position.y = this.position.y.add(this.speed.y.mul(portion).div(100));
  }

  move(): void {
    this.position.x = this.position.x.add(this.speed.x);
    this.position.y = this.position.y.add(this.speed.y);
  }

  checkBrickCollision(brick: Brick): Collision {
    return new Collision({
      time: UInt64.zero,
      target: brick,
      position: this.position,
      speedModifier: IntPoint.from(1, 1),
    });
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
