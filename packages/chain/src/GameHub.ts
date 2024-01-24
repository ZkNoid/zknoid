import {
    RuntimeModule,
    runtimeModule,
    state,
    runtimeMethod,
} from '@proto-kit/module';
import { State, StateMap } from '@proto-kit/protocol';
import {
    Experimental,
    Field,
    UInt64,
    Bool,
    SelfProof,
    Struct,
    PublicKey,
    Provable,
} from 'o1js';
import {
    Bricks,
    Competition,
    GameInputs,
    GameRecordKey,
    LeaderboardScore,
} from './types';

import { GameContext, loadGameContext } from './GameContext';

export class GameRecordPublicOutput extends Struct({
    score: UInt64,
}) {}

export class GameProcessPublicOutput extends Struct({
    initialState: GameContext,
    currentState: GameContext,
}) {}

export function checkMapGeneration(seed: Field, bricks: Bricks): GameContext {
    return loadGameContext(bricks, Bool(false));
}

export const MapGeneration = Experimental.ZkProgram({
    publicInput: Field,
    publicOutput: GameContext,
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

export function initGameProcess(initial: GameContext): GameProcessPublicOutput {
    return new GameProcessPublicOutput({
        initialState: initial,
        currentState: initial,
    });
}

export function processTicks(
    prevProof: SelfProof<void, GameProcessPublicOutput>,
    inputs: GameInputs
): GameProcessPublicOutput {
    prevProof.verify();

    let gameContext = prevProof.publicOutput.currentState;
    for (let i = 0; i < inputs.ticks.length; i++) {
        gameContext.processTick(inputs.ticks[i]);
    }

    return new GameProcessPublicOutput({
        initialState: prevProof.publicOutput.initialState,
        currentState: gameContext,
    });
}

export const GameProcess = Experimental.ZkProgram({
    publicOutput: GameProcessPublicOutput,
    methods: {
        init: {
            privateInputs: [GameContext],
            method: initGameProcess,
        },

        processTicks: {
            privateInputs: [SelfProof, GameInputs],

            method: processTicks,
        },
    },
});

export class GameProcessProof extends Experimental.ZkProgram.Proof(
    GameProcess
) {}

export function checkGameRecord(
    mapGenerationProof: MapGenerationProof,
    gameProcessProof: GameProcessProof
): GameRecordPublicOutput {
    // Verify map generation
    mapGenerationProof.verify();

    // Check if map generation output equal game process initial state
    mapGenerationProof.publicOutput
        .equals(gameProcessProof.publicOutput.initialState)
        .assertTrue();

    // Verify game process
    gameProcessProof.verify();

    // Check if game is won
    gameProcessProof.publicOutput.currentState.alreadyWon.assertTrue();

    // Get score
    return new GameRecordPublicOutput({
        score: gameProcessProof.publicOutput.currentState.score,
    });
}

export const GameRecord = Experimental.ZkProgram({
    publicOutput: GameRecordPublicOutput,
    methods: {
        checkGameRecord: {
            privateInputs: [MapGenerationProof, GameProcessProof],
            method: checkGameRecord,
        },
    },
});

export class GameRecordProof extends Experimental.ZkProgram.Proof(GameRecord) {}

const LEADERBOARD_SIZE = 10;

@runtimeModule()
export class GameHub extends RuntimeModule<unknown> {
    // CompetitionId -> competition
    @state() public competitions = StateMap.from<UInt64, Competition>(
        UInt64,
        Competition
    );
    @state() public lastCompetitonId = State.from<UInt64>(UInt64);

    /// Seed + User => Record
    @state() public gameRecords = StateMap.from<GameRecordKey, UInt64>(
        GameRecordKey,
        UInt64
    );
    /// Unsorted index => user result
    @state() public leaderboard = StateMap.from<UInt64, LeaderboardScore>(
        UInt64,
        LeaderboardScore
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
    public createCompetition(competition: Competition): void {
        this.competitions.set(
            this.lastCompetitonId.get().orElse(UInt64.from(0)),
            competition
        );
        this.lastCompetitonId.set(
            this.lastCompetitonId.get().orElse(UInt64.from(0)).add(1)
        );
    }

    @runtimeMethod()
    public addGameResult(gameRecordProof: GameRecordProof): void {
        gameRecordProof.verify();

        const gameKey = new GameRecordKey({
            competitionId: this.seeds.get(this.lastSeed.get().value).value,
            player: this.transaction.sender,
        });

        const currentScore = this.gameRecords.get(gameKey).value;
        const newScore = gameRecordProof.publicOutput.score;

        if (currentScore < newScore) {
            this.gameRecords.set(gameKey, newScore);

            let looserIndex = UInt64.from(0);
            let looserScore = UInt64.from(0);

            for (let i = 0; i < LEADERBOARD_SIZE; i++) {
                const gameRecord = this.leaderboard.get(UInt64.from(i));

                const result = gameRecord.orElse(
                    new LeaderboardScore({
                        score: UInt64.from(0),
                        player: PublicKey.empty(),
                    })
                );

                looserIndex = Provable.if(
                    result.score.lessThan(looserScore),
                    UInt64.from(i),
                    looserIndex
                );
                looserScore = Provable.if(
                    result.score.lessThan(looserScore),
                    UInt64.from(i),
                    looserScore
                );
            }

            this.leaderboard.set(
                looserIndex,
                new LeaderboardScore({
                    score: newScore,
                    player: this.transaction.sender,
                })
            );
        }
    }
}
