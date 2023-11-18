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

export class GameCell extends Struct({
    value: UInt64, // Indicated lifes of the cell
}) {}

const FIELD_PIXEL_WIDTH = 1000;
const FIELD_PIXEL_HEIGHT = 2000;
const PLATFORM_HALF_WIDTH = 50;

const FIELD_WIDTH = 5;
const FIELD_HEIGHT = 10;

const ADJUST_KOEF = FIELD_PIXEL_WIDTH / FIELD_WIDTH;
const BRICK_SIZE = FIELD_PIXEL_WIDTH / FIELD_WIDTH;

export const FIELD_SIZE = FIELD_WIDTH * FIELD_HEIGHT;

export class GameField extends Struct({
    cells: Provable.Array(GameCell, FIELD_SIZE),
}) {}

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
    gameField: GameField
): MapGenerationPublicOutput {
    return new MapGenerationPublicOutput({});
}

export const mapGeneration = Experimental.ZkProgram({
    publicOutput: MapGenerationPublicOutput,
    methods: {
        checkGameRecord: {
            privateInputs: [Field, GameField],
            method: checkMapGeneration,
        },
    },
});

export class MapGenerationProof extends Experimental.ZkProgram.Proof(
    mapGeneration
) {}

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
    gameField: GameField,
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

        /// 6) Check bricks bump
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
            privateInputs: [GameField, GameInputs],
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
    public addGameResult(
        account: PublicKey,
        gameRecordProof: GameRecordProof
    ): void {
        gameRecordProof.verify();

        const gameKey = new GameRecordKey({
            seed: this.seeds.get(this.lastSeed.get().value).value,
            player: account,
        });

        const currentScore = this.gameRecords.get(gameKey).value;
        const newScore = gameRecordProof.publicOutput.score;

        if (currentScore < newScore) {
            this.gameRecords.set(gameKey, newScore);
        }
    }
}
