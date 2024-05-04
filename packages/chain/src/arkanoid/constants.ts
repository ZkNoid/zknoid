export const INITIAL_SCORE = 99999;
export const SCORE_PER_TICKS = 1;
export const MAX_BRICKS = 10;
export const NEAREST_BRICKS_NUM = 2;

export const BRICK_HALF_WIDTH = 30;
export const FIELD_PIXEL_WIDTH = 720;
export const FIELD_PIXEL_HEIGHT = 720;
export const PLATFORM_HALF_WIDTH = 50;
export const PLATFORM_WIDTH = 130;

export const FIELD_WIDTH = FIELD_PIXEL_WIDTH;
export const FIELD_HEIGHT = FIELD_PIXEL_HEIGHT;

export const ADJUST_KOEF = FIELD_PIXEL_WIDTH / FIELD_WIDTH;
export const BRICK_SIZE = FIELD_PIXEL_WIDTH / FIELD_WIDTH;

export const FIELD_SIZE = FIELD_WIDTH * FIELD_HEIGHT;

export const GAME_LENGTH = 100;
export const CHUNK_LENGTH = 10;

export const DEFAULT_BALL_LOCATION_X = Math.floor(FIELD_WIDTH / 2);
export const DEFAULT_BALL_LOCATION_Y = Math.floor(FIELD_HEIGHT / 2);

export const DEFAULT_BALL_SPEED_X = 4 * 10;
export const DEFAULT_BALL_SPEED_Y = -3 * 10;

export const DEFAULT_PLATFORM_X = Math.floor(FIELD_WIDTH / 4);

export const DEFAULT_PLATFORM_SPEED = PLATFORM_WIDTH;
export const ACCELERATION_TIME = 1;
export const ACCELERATION = DEFAULT_PLATFORM_SPEED / ACCELERATION_TIME;

export const TICK_PERIOD = 300;

export const SEED_MULTIPLIER = 5837482;

export const MAX_BRICK_HEALTH = 3;

export const COLLISION_FINDING_ITERATIONS = 2;

export const PRECISION = 1000;
