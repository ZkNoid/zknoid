import { PublicKey, UInt64, Struct, Provable, Int64, Bool } from 'o1js';

import { CHUNK_LENGTH, GAME_LENGTH, MAX_BRICKS } from './constants';

export class GameRecordKey extends Struct({
    seed: UInt64,
    player: PublicKey,
}) {}

export class Point extends Struct({
    x: UInt64,
    y: UInt64,
}) {
    static from(_x: number, _y: number): Point {
        return new Point({
            x: new UInt64(_x),
            y: new UInt64(_y),
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
    move(): void {
        this.position.x = this.position.x.add(this.speed.x);
        this.position.y = this.position.y.add(this.speed.y);
    }
}

export class Platform extends Struct({
    position: Int64,
}) {
    equals(other: Platform): Bool {
        return this.position.equals(other.position);
    }
}
