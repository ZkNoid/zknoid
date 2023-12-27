import { PublicKey, UInt64, Struct, Provable, Int64, Bool } from 'o1js';

import { GAME_LENGTH, MAX_BRICKS } from './constants';

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
    tiks: Provable.Array(Tick, GAME_LENGTH),
}) {}

export class MapGenerationPublicOutput extends Struct({}) {}

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

    equal(b: IntPoint): Bool {
        return this.x.equals(b.x).and(this.y.equals(b.y));
    }
}

export class Brick extends Struct({
    pos: IntPoint, //
    value: UInt64,
}) {}

export class Bricks extends Struct({
    bricks: Provable.Array(Brick, MAX_BRICKS),
}) {}

export class Ball extends Struct({
    position: IntPoint,
    speed: IntPoint,
}) {
    move(): void {
        this.position.x = this.position.x.add(this.speed.x);
        this.position.y = this.position.y.add(this.speed.y);
    }
}

export class Platform extends Struct({
    position: Int64,
}) {}

export class GameRecordPublicOutput extends Struct({
    score: UInt64,
}) {}
