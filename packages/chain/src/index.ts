export * from './client.config.js';

import {
    GameHub,
    GameRecordProof,
    GameRecordPublicOutput,
    checkGameRecord,
    loadGameContext,
    GameInputs,
    Tick,
    GameRecordKey,
    Brick,
    Bricks,
    IntPoint,
} from './GameHub.js';

import { FIELD_SIZE, GAME_LENGTH, MAX_BRICKS, BRICK_SIZE } from './constants.js';
import { defaultLevel } from './levels.js';

export {
    GameHub,
    GameRecordProof,
    GameRecordPublicOutput,
    checkGameRecord,
    loadGameContext,
    FIELD_SIZE,
    GAME_LENGTH,
    GameInputs,
    Tick,
    GameRecordKey,
    Brick,
    Bricks,
    MAX_BRICKS,
    BRICK_SIZE,
    IntPoint,
    defaultLevel
};
