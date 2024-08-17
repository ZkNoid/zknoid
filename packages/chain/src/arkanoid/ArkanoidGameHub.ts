import {
    Field,
  UInt64,
  Bool,
  SelfProof,
  Struct,
  Int64,
  ZkProgram,
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

export async function checkMapGeneration(seed: Field): Promise<GameContext> {
  const bricks = createBricksBySeed(seed);
  return loadGameContext(bricks, Bool(false));
}

export const MapGeneration = ZkProgram({
  publicInput: Field,
  publicOutput: GameContext,
  name: 'MapGeneration',
  methods: {
    checkMapGeneration: {
      privateInputs: [Bricks],
      method: checkMapGeneration,
    },
  },
});

export class MapGenerationProof extends ZkProgram.Proof(
  MapGeneration,
) {}

export async function initGameProcess(initial: GameContext): Promise<GameProcessPublicOutput> {
  return new GameProcessPublicOutput({
    initialState: initial,
    currentState: initial,
  });
}

export async function processTicks(
  prevProof: SelfProof<void, GameProcessPublicOutput>,
  inputs: GameInputs,
): Promise<GameProcessPublicOutput> {
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

export const GameProcess = ZkProgram({
  publicOutput: GameProcessPublicOutput,
  name: 'GameProcess',
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

export class GameProcessProof extends ZkProgram.Proof(
  GameProcess,
) {}

export async function checkGameRecord(
  mapGenerationProof: MapGenerationProof,
  gameProcessProof: GameProcessProof,
): Promise<GameRecordPublicOutput> {
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

export const GameRecord = ZkProgram({
  publicOutput: GameRecordPublicOutput,
  name: 'GameRecord',
  methods: {
    checkGameRecord: {
      privateInputs: [MapGenerationProof, GameProcessProof],
      method: checkGameRecord,
    },
  },
});

export class GameRecordProof extends ZkProgram.Proof(GameRecord) {}
@runtimeModule()
export class ArkanoidGameHub extends Gamehub<
  undefined,
  GameRecordPublicOutput,
  GameRecordProof
> {
  @runtimeMethod()
  public async addGameResult(competitionId: UInt64, proof: GameRecordProof) {
    await super.addGameResult(competitionId, proof);
  }
}
