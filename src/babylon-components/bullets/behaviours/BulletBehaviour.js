import { Texture } from '@babylonjs/core';
import { ARENA_MAX, ARENA_MIN } from '../../../utils/Constants';
import { globalActorRefs, preComputedBulletTextures, preComputedEndTimingsTextures } from '../../gameLogic/StaticRefs';
import { makeTextureFromArray, makeTextureFromBlank, makeTextureFromVectors } from '../BulletUtils';
import DifferentialPositionVelocityCollisionSystem from './DifferentialPositionVelocityCollisionSystem';

export class BulletBehaviour {
    constructor(positionShader, velocityShader, parent, collideWithEnvironment, initialValuesFunction = null, radius = 1, bulletValue = 1) {
        if (!collideWithEnvironment.x) {
            throw new Error('collideWithEnvironment must be a vector');
        }

        this.parent = parent;
        this.positionShader = positionShader;
        this.velocityShader = velocityShader;
        this.collideWithEnvironment = collideWithEnvironment;
        this.radius = radius;
        this.spawning = 1.;
        this.bulletValue = bulletValue;

        this.initialValuesFunction = initialValuesFunction;
    }

    bindCollisionVars(texture) {
        texture.setVector3('arenaMin', ARENA_MIN);
        texture.setVector3('arenaMax', ARENA_MAX);
        texture.setVector3('collideWithEnvironment', this.collideWithEnvironment);
    }

    init(bulletMaterial, initialPositions, initialVelocities, timings, endTimings, reliesOnParent, disableWarning, uid, scene) {
        const num = timings.length;
        const startPositionsState = preComputedBulletTextures[uid]?.positions || makeTextureFromBlank(timings.length, scene, 1., -510., -510.) //All positions are invalid until enter time
        const startCollisionsState = preComputedBulletTextures[uid]?.collisions || makeTextureFromBlank(timings.length, scene, 0, 0); //No collisions
        const startVelocitiesState = preComputedBulletTextures[uid]?.velocities || makeTextureFromVectors(initialVelocities, scene, 1, 0);


        const initialPositionsTexture =
            preComputedBulletTextures[uid]?.initialPositions ||
            ((initialPositions instanceof Texture) ? initialPositions :
                makeTextureFromVectors(initialPositions, scene, 1, -510));
        const timingsTexture = preComputedBulletTextures[uid]?.timings || makeTextureFromArray(timings, scene);
        const endTimingsTexture = preComputedEndTimingsTextures[uid] || makeTextureFromArray(endTimings, scene);


        this.diffSystem = new DifferentialPositionVelocityCollisionSystem(
            num,
            startPositionsState,
            startVelocitiesState,
            startCollisionsState,
            this.positionShader,
            this.velocityShader,
            this.collisionShader,
            this.isEnemyBullet,
            scene,
            (texture) => {
                texture.setTexture('initialPositionSampler', initialPositionsTexture);
                texture.setTexture('timingsSampler', timingsTexture);
                texture.setTexture('endTimingsSampler', endTimingsTexture);
                texture.setVector3('playerPosition', globalActorRefs.player.position);
                texture.setVector3('parentPosition', this.parent.getAbsolutePosition());
                texture.setFloat('reliesOnParent', reliesOnParent);
                texture.setFloat('timeSinceStart', 0.001)
            },
            this.initialValuesFunction,
            this.initialValuesFunction,
            this.bindCollisionVars
        )

        bulletMaterial.setTexture('positionSampler', startPositionsState);
        bulletMaterial.setTexture('velocitySampler', startVelocitiesState);
        bulletMaterial.setTexture('collisionSampler', startCollisionsState);
        bulletMaterial.setTexture('timingsSampler', timingsTexture);
        bulletMaterial.setTexture('endTimingsSampler', endTimingsTexture);
        bulletMaterial.setFloat('timeSinceStart', 0.001);
        bulletMaterial.setFloat('radius', this.radius);
        bulletMaterial.setFloat('disableWarning', disableWarning ? 1 : 0)

        this.justStarted = true;
        this.frame = 0;
        this.bulletMaterial = bulletMaterial;
        this.ready = true;
        this.timeSinceStart = 0.001;
    }
    dispose() {
        this.diffSystem.dispose()
        this.ready = false;
    }
    update(deltaS) {
        if (!this.ready) {
            return false;
        }

        this.timeSinceStart += deltaS

        const updateResult = this.diffSystem.update(
            deltaS,
            (texture) => {
                texture.setVector3('parentPosition', this.parent.getAbsolutePosition());
                texture.setFloat('timeSinceStart', this.timeSinceStart);
                texture.setVector3('playerPosition', globalActorRefs.player.position);
            }
        )

        if (!updateResult) return updateResult;

        const [newPositions, newVelocities, newCollisions] = updateResult;

        this.bulletMaterial.setTexture('positionSampler', newPositions);
        this.bulletMaterial.setTexture('velocitySampler', newVelocities);
        this.bulletMaterial.setTexture('collisionSampler', newCollisions);
        this.bulletMaterial.setFloat('timeSinceStart', this.timeSinceStart);

        return updateResult;
    }
}
