import { Matrix, Vector3 } from '@babylonjs/core';
import { times } from 'lodash';
import { MAX_BOMBS, MAX_BULLETS_PER_GROUP, MAX_ENEMIES } from '../../utils/Constants';

export const globalCallbacks = {};
export const allBullets = {};

export const makeEnemyDefaultVals = () => ({
    position: new Vector3(-510, -510, -510),
    health: -510,
    radius: 0,
    onDeath: () => { },
    dead: true,
});

export const makeDefaultBomb = () => ({
    position: new Vector3(-510, -510, -510),
    radius: 0,
    dead: true
});

export const globalActorRefs = {
    enemies: times(MAX_ENEMIES, makeEnemyDefaultVals),
    bombs: times(MAX_BOMBS, makeDefaultBomb),
    player: {
        position: new Vector3(0, 0, 0),
    },
    bombPositionBuffer: new Float32Array(times(MAX_BOMBS * 3, () => -510)),
    bombRadiiBuffer: new Float32Array(times(MAX_BOMBS, () => 0)),
    enemyPositionBuffer: new Float32Array(times(MAX_ENEMIES * 3, () => -510)),
    enemyRadiiBuffer: new Float32Array(times(MAX_ENEMIES, () => 0)),
    enemyIndex: 0,
};

export const addBomb = (id, position, radius) => {
    globalActorRefs.bombs[id] = {
        position: position,
        radius: radius
    }

}

export const removeBomb = (id) => {
    globalActorRefs.bombs[id] = makeDefaultBomb()
}

export const setBombPosition = (id, position) => {
    if (globalActorRefs.bombs[id].dead) return;
    globalActorRefs.bombs[id].position = position;
}

export const setBombRadius = (id, radius) => {
    if (globalActorRefs.bombs[id].dead) return;
    globalActorRefs.bombs[id].radius = radius;
}

export const addEnemy = (position, radius, onDeath, health, isBoss) => {
    const indexToAdd = isBoss ? 0 : globalActorRefs.enemyIndex;
    if (!globalActorRefs.enemies[indexToAdd].dead) throw new Error(">" + MAX_ENEMIES + "In scene")
    globalActorRefs.enemies[indexToAdd] = {
        position,
        health,
        radius,
        onDeath,
        id: indexToAdd
    };
    globalActorRefs.enemyIndex = Math.max((globalActorRefs.enemyIndex + 1) % MAX_ENEMIES, 1);
    return indexToAdd;
};

export const removeEnemy = (id) => {
    globalActorRefs.enemies[id] = makeEnemyDefaultVals();
};

export const killEnemy = (id) => {
    if (!globalActorRefs.enemies[id].dead) {
        globalActorRefs.enemies[id].onDeath();
        removeEnemy(id);
    }
};

export const bufferMatricesSource = new Float32Array(MAX_BULLETS_PER_GROUP * 16);
for (let i = 0; i < MAX_BULLETS_PER_GROUP; i++) {
    const matrix = Matrix.Identity();
    matrix.copyToArray(bufferMatricesSource, i * 16);
}

export const preComputedBulletPatterns = {};
export const preComputedBulletTextures = {};
export const preComputedEndTimings = {};
export const preComputedEndTimingsTextures = {};
