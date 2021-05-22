import { Constants, Vector2 } from '@babylonjs/core';
import { times } from "lodash";
import nextPOT from 'next-power-of-two';
import { v4 } from 'uuid';
import { CustomCustomProceduralTexture } from '../../CustomCustomProceduralTexture';
import { parallelReducer } from '../BulletUtils';

const makeProceduralTexture = (name, shader, WIDTH, scene) => {
    const proceduralTexture = new CustomCustomProceduralTexture(
        name + v4(),
        shader,
        WIDTH,
        scene,
        false,
        false,
        false,
        Constants.TEXTURETYPE_FLOAT
    );

    return proceduralTexture;
}

export default class DifferentialPositionVelocityCollisionSystem {
    constructor(
        num,
        startPositionState,
        startVelocityState,
        startCollisionState,
        positionShader,
        velocityShader,
        collisionShader,
        downsampleCollisions,
        scene,
        initialValuesFunction,
        initialPositionValuesFunction = false,
        initialVelocityValuesFunction = false,
        initialCollisionValuesFunction = false
    ) {
        const WIDTH = Math.max(nextPOT(Math.ceil(Math.sqrt(num))), 2);

        this.positionTextures = times(2, () => makeProceduralTexture("position", positionShader, WIDTH, scene));
        this.velocityTextures = times(2, () => makeProceduralTexture("velocity", velocityShader, WIDTH, scene));
        this.collisionTextures = times(2, () => makeProceduralTexture("collision", collisionShader, WIDTH, scene));

        this.allTextures = [
            ...this.positionTextures,
            ...this.velocityTextures,
            ...this.collisionTextures
        ];

        this.allTextures.forEach(texture => {
            texture.setTexture('positionSampler', startPositionState);
            texture.setTexture('velocitySampler', startVelocityState);
            texture.setTexture('collisionSampler', startCollisionState);
            texture.setVector2('resolution', new Vector2(WIDTH, WIDTH));
            texture.setFloat('delta', 0.001);
        })

        this.allTextures.forEach(initialValuesFunction)

        if (initialPositionValuesFunction) {
            this.positionTextures.forEach(initialPositionValuesFunction);
        }
        if (initialVelocityValuesFunction) {
            this.velocityTextures.forEach(initialVelocityValuesFunction);
        }
        if (initialCollisionValuesFunction) {
            this.collisionTextures.forEach(initialCollisionValuesFunction);
        }

        if (downsampleCollisions) {
            const [collisionResult, reducerLayers] = parallelReducer(this.collisionTextures[0], WIDTH, scene);
            this.collisionResult = collisionResult;
            this.reducerLayers = reducerLayers;
        }
        else {
            this.collisionResult = this.collisionTextures[0]
        }

        this.frame = 0;
        this.ready = true;
        this.justStarted = true;
    }

    dispose() {
        this.allTextures.forEach(texture => {
            texture.dispose();
        })

        this.collisionResult.dispose();

        if (this.reducerLayers) {
            this.reducerLayers.forEach((reducer) => {
                reducer.dispose();
            });
        }

        this.ready = false;
    }

    update(deltaS, bindOtherUniforms) {
        if (!this.ready) {
            return false;
        }

        if (
            this.allTextures.some(texture => {
                return !texture.isReady()
            })
        ) {
            return false;
        }

        if (this.justStarted) {
            this.justStarted = false;
            this.allTextures.forEach(texture => {
                texture.isReady = () => true;
            })
        }

        this.timeSinceStart += deltaS

        const source = this.frame % 2;
        const dest = (this.frame + 1) % 2;


        this.positionTextures[source].sleep = false;
        this.velocityTextures[source].sleep = false;
        this.collisionTextures[source].sleep = false;
        this.positionTextures[dest].sleep = true;
        this.velocityTextures[dest].sleep = true;
        this.collisionTextures[dest].sleep = true;

        const bindSouceTextures = (destTexture) => {
            destTexture.setTexture('positionSampler', this.positionTextures[source])
            destTexture.setTexture('velocitySampler', this.velocityTextures[source])
            destTexture.setTexture('collisionSampler', this.collisionTextures[source])
            destTexture.setFloat('delta', deltaS);
            bindOtherUniforms(destTexture);
        }

        bindSouceTextures(this.positionTextures[dest])
        bindSouceTextures(this.velocityTextures[dest])
        bindSouceTextures(this.collisionTextures[dest])

        if (this.reducerLayers) {
            this.reducerLayers[0].setTexture('source', this.collisionTextures[dest]);
        } else {
            this.collisionResult = this.collisionTextures[dest];
        }

        this.frame = (this.frame + 1) % 2;

        return [this.positionTextures[dest], this.velocityTextures[dest], this.collisionTextures[dest]];
    }
}
