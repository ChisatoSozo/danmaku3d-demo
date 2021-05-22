import { Vector3 } from '@babylonjs/core';

export const ARENA_WIDTH = 15;
export const ARENA_HEIGHT = 10;
export const ARENA_FLOOR = 1;
export const ARENA_LENGTH = 20;
export const LATERAL_SPEED = 10;
export const ARENA_DIMS = [ARENA_WIDTH, ARENA_HEIGHT, ARENA_LENGTH];
export const ARENA_MAX = new Vector3(ARENA_WIDTH / 2, ARENA_HEIGHT, ARENA_LENGTH / 2);
export const ARENA_MIN = new Vector3(-ARENA_WIDTH / 2, 0, -ARENA_LENGTH / 2);

export const MAX_ENEMIES = 50;
export const MAX_BOMBS = 8;
export const MAX_BULLETS_PER_GROUP = 100000;
export const PLAYER_BULLETS_WHEEL_LENGTH = 50;

export const nullVector = new Vector3(-510, -510, -510)
export const zVector = new Vector3(0, 0, 1);

export const GRAZE_DISTANCE = 0.5;
export const PLAYER_INVULNERABLE_COOLDOWN = 2;
export const PLAYER_BOMB_DURATION = 8;
export const TARGET_LENGTH = 15;

export const DEV_COLLISIONS_CHANGE_POSITION = true;
export const DEV_REHYDRATE_LS = true;
export const DEV_RESET_LS = false;
export const DEV_ALWAYS_FULL_POWER = false;
export const DEV_OVERPOWERED = true;

export const BULLET_WARNING = 0.2;

export const DIFFICULTY = {
    Easy: 1,
    Normal: 2,
    Hard: 3,
    Lunatic: 4,
}

export const CHARACTER_CONSTS = {
    reimu: {
        color: '#FF0A33',
    },
    marisa: {
        color: '#00AAFF',
    },
    wriggle: {
        color: '#00aa88',
    },
};
