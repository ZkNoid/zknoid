import {
    RuntimeModule,
    runtimeModule,
    state,
    runtimeMethod,
} from '@proto-kit/module';
import { State, StateMap } from '@proto-kit/protocol';
import { Experimental, Field, UInt64, Bool, SelfProof } from 'o1js';
import {
    Bricks,
    GameInputs,
    GameRecordKey,
    GameRecordPublicOutput,
    MapGenerationPublicOutput,
} from './types';

import { GameContext, loadGameContext } from './GameContext';

export function checkMapGeneration(
    seed: Field,
    bricks: Bricks
): MapGenerationPublicOutput {
    return new MapGenerationPublicOutput({});
}

export function checkGameRecord(
    bricks: Bricks,
    gameInputs: GameInputs,
    debug: Bool
): GameRecordPublicOutput {
    const gameContext = loadGameContext(bricks, debug);

    for (let i = 0; i < gameInputs.tiks.length; i++) {
        gameContext.processTick(gameInputs.tiks[i]);
    }

    gameContext.alreadyWon.assertTrue();

    return new GameRecordPublicOutput({ score: gameContext.score });
}

export const MapGeneration = Experimental.ZkProgram({
    publicInput: Field,
    publicOutput: MapGenerationPublicOutput,
    methods: {
        checkMapGeneration: {
            privateInputs: [Bricks],
            method: checkMapGeneration,
        },
    },
});

export class MapGenerationProof extends Experimental.ZkProgram.Proof(
    MapGeneration
) {}

export const GameProcess = Experimental.ZkProgram({
    publicOutput: GameContext, // change
    methods: {
        init: {
            privateInputs: [GameContext],
            method(gameContext: GameContext): GameContext {
                return gameContext;
            },
        },

        processTicks: {
            privateInputs: [SelfProof, GameInputs],

            method(
                prevProof: SelfProof<GameContext, GameContext>,
                inputs: GameInputs
            ): GameContext {
                return prevProof.publicOutput;
            },
        },
    },
});

export class GameProcessProof extends Experimental.ZkProgram.Proof(
    GameProcess
) {}

export const GameRecord = Experimental.ZkProgram({
    publicOutput: GameRecordPublicOutput,
    methods: {
        checkGameRecord: {
            privateInputs: [Bricks, GameInputs, Bool],
            method: checkGameRecord,
        },
    },
});

export class GameRecordProof extends Experimental.ZkProgram.Proof(GameRecord) {}

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
