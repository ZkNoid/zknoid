import { ToFieldable } from '@proto-kit/common';
import {
    RuntimeModule,
    runtimeModule,
    state,
    runtimeMethod,
} from '@proto-kit/module';
import { State, StateMap, assert } from '@proto-kit/protocol';
import {
    Experimental,
    PublicKey,
    Field,
    UInt64,
    Struct,
    arrayProp,
    MerkleMap,
    CircuitString,
    Provable,
    Int64,
    Bool,
    Proof,
} from 'o1js';

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

const MAX_BRICKS = 20;

const BRICK_HALF_WIDTH = 25;
const FIELD_PIXEL_WIDTH = 1000;
const FIELD_PIXEL_HEIGHT = 2000;
const PLATFORM_HALF_WIDTH = 50;

const FIELD_WIDTH = 5;
const FIELD_HEIGHT = 10;

const ADJUST_KOEF = FIELD_PIXEL_WIDTH / FIELD_WIDTH;
const BRICK_SIZE = FIELD_PIXEL_WIDTH / FIELD_WIDTH;

export const FIELD_SIZE = FIELD_WIDTH * FIELD_HEIGHT;

export const GAME_LENGTH = 1000;

export class Tick extends Struct({
    action: UInt64,
}) {}

export class GameInputs extends Struct({
    tiks: Provable.Array(Tick, GAME_LENGTH),
}) {}

class MapGenerationPublicOutput extends Struct({}) {}

export function checkMapGeneration(
    seed: Field,
    bricks: Bricks
): MapGenerationPublicOutput {
    return new MapGenerationPublicOutput({});
}

// export const mapGeneration = Experimental.ZkProgram({
//     publicOutput: MapGenerationPublicOutput,
//     methods: {
//         checkGameRecord: {
//             privateInputs: [Field, Bricks],
//             method: checkMapGeneration,
//         },
//     },
// });

// export class MapGenerationProof extends Experimental.ZkProgram.Proof(
//     mapGeneration
// ) {}

export class GameRecordPublicOutput extends Struct({
    score: UInt64,
}) {}

/////////////////////////////////// Game logic structs //////////////////////////////////

class IntPoint extends Struct({
    x: Int64,
    y: Int64,
}) {
    static from(_x: number, _y: number): IntPoint {
        return new IntPoint({
            x: Int64.from(_x),
            y: Int64.from(_y),
        });
    }
}

export class Brick extends Struct({
    pos: IntPoint, //
    value: UInt64,
}) {}

export class Bricks extends Struct({
    bricks: Provable.Array(Brick, MAX_BRICKS),
}) {}

class Ball extends Struct({
    position: IntPoint,
    speed: IntPoint,
}) {
    move(): void {
        this.position.x = this.position.x.add(this.speed.x);
        this.position.y = this.position.y.add(this.speed.y);
    }
}

class Platform extends Struct({
    position: Int64,
}) {}

////////////////////////////////// Game logic structs end ////////////////////////////////

const DEFAULT_BALL_LOCATION = IntPoint.from(100, 100);
const DEFAULT_BALL_SPEED = IntPoint.from(1, 1);
const DEFAULT_PLATFORM_LOCATION = Int64.from(100);

export function checkGameRecord(
    bricks: Bricks,
    gameInputs: GameInputs
): GameRecordPublicOutput {
    let winable = Bool(true);
    let score = UInt64.from(0);
    let ball = new Ball({
        position: DEFAULT_BALL_LOCATION,
        speed: DEFAULT_BALL_SPEED,
    });
    let platform = new Platform({
        position: DEFAULT_PLATFORM_LOCATION,
    });

    for (let i = 0; i < gameInputs.tiks.length; i++) {
        // 1) Update score
        score = score.add(1);

        /// 2) Update platform position
        /// Check for underflow/overflow
        platform.position = platform.position
            .add(1)
            .sub(gameInputs.tiks[i].action);

        /// 3) Update ball position
        const prevBallPos = new IntPoint({
            x: ball.position.x,
            y: ball.position.y,
        });

        ball.move();

        /// 4) Check for edge bumps

        const leftBump = ball.position.x.isPositive().not();
        const rightBump = ball.position.x.sub(FIELD_PIXEL_WIDTH).isPositive();
        const topBump = ball.position.y.sub(FIELD_PIXEL_HEIGHT).isPositive();
        const bottomBump = ball.position.y.isPositive().not();

        /// Add come constrains just in case

        // If bumf - just return it and change speed
        ball.position.x = Provable.if(leftBump, Int64.from(0), ball.position.x);
        ball.position.x = Provable.if(
            rightBump,
            Int64.from(FIELD_PIXEL_WIDTH),
            ball.position.x
        );

        ball.speed.x = Provable.if(
            leftBump.or(rightBump),
            ball.speed.x.neg(),
            ball.speed.x
        );

        ball.position.y = Provable.if(
            topBump,
            Int64.from(FIELD_PIXEL_HEIGHT),
            ball.position.y
        );
        ball.position.y = Provable.if(
            bottomBump,
            Int64.from(0),
            ball.position.y
        );

        ball.speed.y = Provable.if(
            topBump.or(bottomBump),
            ball.speed.y.neg(),
            ball.speed.y
        );

        /// 5) Check platform bump
        let isFail = bottomBump.and(
            /// Too left from the platform
            ball.position.x
                .sub(platform.position.sub(PLATFORM_HALF_WIDTH))
                .isPositive()
                .not()
                .or(
                    // Too right from the platform
                    ball.position.x
                        .sub(platform.position.add(PLATFORM_HALF_WIDTH))
                        .isPositive()
                )
        );

        winable = winable.and(isFail.not());

        //6) Check bricks bump

        for (let j = 0; j < MAX_BRICKS; j++) {
            const currentBrick = bricks.bricks[j];
            let isAlive = currentBrick.value.greaterThan(UInt64.from(0));

            let leftBorder = currentBrick.pos.x.sub(BRICK_HALF_WIDTH);
            let rightBorder = currentBrick.pos.x.add(BRICK_HALF_WIDTH);
            let topBorder = currentBrick.pos.y.add(BRICK_HALF_WIDTH);
            let bottomBorder = currentBrick.pos.y.sub(BRICK_HALF_WIDTH);

            /*
            Collision
                ball.pos.x \inc [leftBorder, rightBorder]
                ball.pos.y \inc [bottomBorder, topBorder]

            */

            const horizontalCollision = rightBorder
                .sub(ball.position.x)
                .isPositive()
                .and(ball.position.x.sub(leftBorder).isPositive());

            const verticalCollision = topBorder
                .sub(ball.position.y)
                .isPositive()
                .and(ball.position.y.sub(bottomBorder).isPositive());

            const collisionHappen = isAlive.and(
                horizontalCollision.and(verticalCollision)
            );

            /*
                Detect where collision ocured
                /////////////// vertical part of a brick //////////////////////////
                y = d
                ay = bx + c;
                c = ay1 - bx1
                    a - ball.speed.x
                    b - ball.speed.y
                bx = ay - c
                bx = ad - c;

                x \incl [ brick.pos.x - BRICK_HALF_WIDTH, brick.pos.x + BRICK_HALF_WIDTH ]
                bx \incl [b(brics.pos.x - BRICK_HALF_WIDTH, b(brick.pos.x + BRICK_HALF_WIDTH))]
                ad - c \incl [b(brics.pos.x - BRICK_HALF_WIDTH, b(brick.pos.x + BRICK_HALF_WIDTH))]
                


                /////////////// horizontal part of a brick ////////////////////////////
                x = d
                ay = bx + c
                c = ay1 - bx1
                    a - ball.speed.x
                    b - ball.speed.y
                ay = bd + c

                y \incl [ brick.pos.y - BRICK_HALF_WIDTH, brick.pos.y + BRICK_HALF_WIDTH]
                ay \incl [ a(brick.pos.y - BRICK_HALF_WIDTH), a(brick.pos.y + BRICK_HALF_WIDTH)]
                bd + c \incl [ a(brick.pos.y - BRICK_HALF_WIDTH), a(brick.pos.y + BRICK_HALF_WIDTH)]
            */

            let a = ball.speed.x;
            let b = ball.speed.y;
            let c = a.mul(ball.position.y).sub(b.mul(ball.position.x));

            // Top horizontal
            let d1 = topBorder;
            let adc1 = a.mul(d1).sub(c);
            let crossBrickTop = adc1
                .sub(b.mul(leftBorder))
                .isPositive()
                .and(b.mul(rightBorder).sub(adc1).isPositive());
            let hasTopBump = crossBrickTop.and(
                prevBallPos.y.sub(topBorder).isPositive()
            );

            // Bottom horisontal
            let d2 = bottomBorder;
            let adc2 = a.mul(d2).sub(c);
            let crossBrickBottom = adc2
                .sub(b.mul(leftBorder))
                .isPositive()
                .and(b.mul(rightBorder).sub(adc2).isPositive());
            let hasBottomBump = crossBrickBottom.and(
                bottomBorder.sub(prevBallPos.y).isPositive()
            );

            // Left vertical
            let d3 = leftBorder;
            let bdc1 = b.mul(d3).add(c);
            let crossBrickLeft = a
                .mul(topBorder)
                .sub(bdc1)
                .isPositive()
                .and(bdc1.sub(a.mul(bottomBorder)).isPositive());
            let hasLeftBump = crossBrickLeft.and(
                leftBorder.sub(prevBallPos.x).isPositive()
            );

            // Right vertical
            let d4 = rightBorder;
            let bdc2 = b.mul(d4).add(c);
            let crossBrickRight = a
                .mul(topBorder)
                .sub(bdc2)
                .isPositive()
                .and(bdc2.sub(a.mul(bottomBorder)).isPositive());
            let hasRightBump = crossBrickRight.and(
                prevBallPos.x.sub(rightBorder).isPositive()
            );

            // Reduce health if coliision happend and brick is not dead
            currentBrick.value = Provable.if(
                collisionHappen,
                currentBrick.value.sub(1),
                currentBrick.value
            );

            ball.speed.x = Provable.if(
                hasLeftBump.or(hasRightBump),
                ball.speed.x.neg(),
                ball.speed.x
            );

            ball.speed.y = Provable.if(
                hasBottomBump.or(hasTopBump),
                ball.speed.y.neg(),
                ball.speed.y
            );
        }

        /*
        let gridX = ball.position.x.div(ADJUST_KOEF);
        let gridY = ball.position.y.div(ADJUST_KOEF);

        gridX.sub(FIELD_WIDTH).isPositive().assertFalse(); // No index out of length
        gridX.isPositive().assertTrue();
        gridY.sub(FIELD_HEIGHT).isPositive().assertFalse();
        gridY.isPositive().assertTrue();

        let gridXNum = gridX.toConstant();
        let gridYNum = gridY.toConstant();
        // gridX + gridY * FIELD_WIDTH

        let element = new GameCell({ value: UInt64.from(0) });
        for (let i = 0; i++; i < gameField.cells.length) {
            // let _x:ToFieldable = gameField.cells[i];
            // GameCell.toFields(gameField.cells[i])
            element = Provable.if(
                Int64.from(i).equals(gridX),
                GameCell,
                gameField.cells[i],
                element
            );
        }

        // gameField.cells[Number(gridX.toField().toString())]

        */
    }

    return new GameRecordPublicOutput({ score });
}

export const gameRecord = Experimental.ZkProgram({
    // publicInput: Field,
    publicOutput: GameRecordPublicOutput,
    methods: {
        checkGameRecord: {
            // privateInputs: [],
            privateInputs: [Bricks, GameInputs],
            method: checkGameRecord,
        },
    },
});

export class GameRecordProof extends Experimental.ZkProgram.Proof(gameRecord) {}

@runtimeModule()
export class GameHub extends RuntimeModule<unknown> {
    /// Seed + User => Record
    @state() public gameRecords = StateMap.from<GameRecordKey, UInt64>(
        GameRecordKey,
        UInt64
    );
    @state() public seeds = StateMap.from<UInt64, UInt64>(UInt64, UInt64);
    @state() public lastSeed = State.from<UInt64>(UInt64);
    @state() public lastUpdate = State.from<UInt64>(UInt64);

    @runtimeMethod()
    public updateSeed(seed: UInt64): void {
        const lastSeedIndex = this.lastSeed.get().orElse(UInt64.from(0));
        this.seeds.set(lastSeedIndex, seed);
        this.lastSeed.set(lastSeedIndex.add(1));
    }

    @runtimeMethod()
    /// Check for user public key
    public addGameResult(gameRecordProof: GameRecordProof): void {
        gameRecordProof.verify();

        const gameKey = new GameRecordKey({
            seed: this.seeds.get(this.lastSeed.get().value).value,
            player: this.transaction.sender,
        });

        const currentScore = this.gameRecords.get(gameKey).value;
        const newScore = gameRecordProof.publicOutput.score;

        if (currentScore < newScore) {
            this.gameRecords.set(gameKey, newScore);
        }
    }
}
