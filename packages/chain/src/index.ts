export * from './client.config.js';

import {
    GameHub,
    GameRecordProof,
    // GameRecordPublicOutput,
    checkGameRecord,
    loadGameContext,
    // GameInputs,
    // Tick,
    // GameRecordKey,
    // Brick,
    // Bricks,
    // IntPoint,
} from './GameHub.js';

import {
    // GameHub,
    // GameRecordProof,
    GameRecordPublicOutput,
    // checkGameRecord,
    // loadGameContext,
    GameInputs,
    Tick,
    GameRecordKey,
    Brick,
    Bricks,
    IntPoint,
} from './types.js';

import {
    BRICK_HALF_WIDTH,
    FIELD_SIZE,
    GAME_LENGTH,
    MAX_BRICKS,
    BRICK_SIZE,
    FIELD_WIDTH,
    FIELD_HEIGHT,
    DEFAULT_BALL_LOCATION_X,
    DEFAULT_BALL_LOCATION_Y,
    DEFAULT_BALL_SPEED_X,
    DEFAULT_BALL_SPEED_Y,
    TICK_PERIOD,
    DEFAULT_PLATFORM_SPEED,
} from './constants.js';
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
    BRICK_HALF_WIDTH,
    MAX_BRICKS,
    BRICK_SIZE,
    FIELD_WIDTH,
    FIELD_HEIGHT,
    DEFAULT_BALL_LOCATION_X,
    DEFAULT_BALL_LOCATION_Y,
    DEFAULT_BALL_SPEED_X,
    DEFAULT_BALL_SPEED_Y,
    IntPoint,
    defaultLevel,
    TICK_PERIOD,
    DEFAULT_PLATFORM_SPEED,
};
