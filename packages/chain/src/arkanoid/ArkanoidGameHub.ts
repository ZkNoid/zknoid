import {
  Experimental,
  Field,
  UInt64,
  Bool,
  SelfProof,
  Struct,
  Int64,
} from 'o1js';
import { runtimeMethod, runtimeModule } from '@proto-kit/module';
import { Gamehub } from '../engine/GameHub';
import { Bricks, GameInputs } from './types';
import {
  GameContext,
  createBricksBySeed,
  loadGameContext,
} from './GameContext';

export class GameRecordPublicOutput extends Struct({
  score: UInt64,
}) {}

export class GameProcessPublicOutput extends Struct({
  initialState: GameContext,
  currentState: GameContext,
}) {}

export function checkMapGeneration(seed: Field): GameContext {
  const bricks = createBricksBySeed(seed);
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
  MapGeneration,
) {}

export function initGameProcess(initial: GameContext): GameProcessPublicOutput {
  return new GameProcessPublicOutput({
    initialState: initial,
    currentState: initial,
  });
}

export function processTicks(
  prevProof: SelfProof<void, GameProcessPublicOutput>,
  inputs: GameInputs,
): GameProcessPublicOutput {
  prevProof.verify();

  const gameContext = prevProof.publicOutput.currentState;
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
  GameProcess,
) {}

export function checkGameRecord(
  mapGenerationProof: MapGenerationProof,
  gameProcessProof: GameProcessProof,
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

@runtimeModule()
export class ArkanoidGameHub extends Gamehub<
  undefined,
  GameRecordPublicOutput,
  GameRecordProof
> {
  @runtimeMethod()
  public addGameResult(competitionId: UInt64, proof: GameRecordProof) {
    super.addGameResult(competitionId, proof);
  }
}
