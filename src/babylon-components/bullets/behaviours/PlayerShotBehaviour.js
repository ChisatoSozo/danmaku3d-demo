import { Vector3 } from '@babylonjs/core';
import { times } from 'lodash';
import { PLAYER_BULLETS_WHEEL_LENGTH } from '../../../utils/Constants';
import { glsl } from '../../BabylonUtils';
import { makeTextureFromVectors } from '../BulletUtils';
import { collisionSnippet, mainHeaderSnippet, uniformSnippet } from './Common';
import { PlayerBulletBehaviour } from './PlayerBulletBehaviour';

export const playerShotBehaviourPositionPixelShader = glsl`
    ${uniformSnippet}

    uniform float firing;
    uniform float frame;
    uniform float numSources;
    uniform vec3 sourceOffset;
    uniform sampler2D sourceSampler;

    void main()	{
        ${mainHeaderSnippet}

        float currentWindowStart = frame * numSources;
        float currentWindowEnd = currentWindowStart + numSources;

        float bulletEnabled = float((id > (currentWindowStart - 0.1)) && (id < (currentWindowEnd - 0.1))) * firing;
        float bulletNotEnabled = 1. - bulletEnabled;

        float idInSource = id - currentWindowStart;

        int instance = int(idInSource);
        int width = textureSize(sourceSampler, 0).x;
        int x = instance % width;
        int y = instance / width;                            // integer division
        float u = (float(x) + 0.5) / float(width);           // map into 0-1 range
        float v = (float(y) + 0.5) / float(width);
        
        vec3 source = texture(sourceSampler, vec2(u, v)).xyz + sourceOffset;

        vec4 out_Position = bulletNotEnabled * vec4(position + (velocity * delta), 1.) + bulletEnabled * vec4(source, 1.);

        ${collisionSnippet}

        gl_FragColor = out_Position;
    }
`;

export const playerShotBehaviourVelocityPixelShader = glsl`
    ${uniformSnippet}

    uniform float firing;
    uniform float frame;
    uniform float numSources;
    uniform float focused;
    uniform vec3 shotVector;
    uniform sampler2D initialVelocitySampler;

    void main() {
        ${mainHeaderSnippet}

        float currentWindowStart = frame * numSources;
        float currentWindowEnd = currentWindowStart + numSources;

        float bulletEnabled = float((id > (currentWindowStart - 0.1)) && (id < (currentWindowEnd - 0.1))) * firing;
        float bulletNotEnabled = 1. - bulletEnabled;

        float idInSource = id - currentWindowStart;

        int instance = int(idInSource);
        int width = textureSize(initialVelocitySampler, 0).x;
        int x = instance % width;
        int y = instance / width;                            // integer division
        float u = (float(x) + 0.5) / float(width);           // map into 0-1 range
        float v = (float(y) + 0.5) / float(width);
        
        vec3 velocityOffset = texture(initialVelocitySampler, vec2(u, v)).xyz * (1. - focused);

        gl_FragColor = (bulletNotEnabled * vec4(velocity, 1.)) + (bulletEnabled * vec4(shotVector + velocityOffset, 1.));
    }
`;

class PlayerShotBehaviour extends PlayerBulletBehaviour {
    constructor(behaviourOptions, environmentCollision, parent) {
        const sourceSampler = makeTextureFromVectors(behaviourOptions.shotSources);
        const initialVelocitySampler = makeTextureFromVectors(
            behaviourOptions.initialVelocities || times(behaviourOptions.shotSources.length, () => new Vector3(0, 0, 0))
        );

        super('playerShotBehaviourPosition', 'playerShotBehaviourVelocity', parent, environmentCollision,
            (texture) => {
                texture.setFloat('frame', 0);
                texture.setFloat('firing', 0);
                texture.setVector3('shotVector', new Vector3(0, 0, 0));
                texture.setVector3('sourceOffset', new Vector3(0, 0, 0));
                texture.setTexture('sourceSampler', sourceSampler);
                texture.setTexture('initialVelocitySampler', initialVelocitySampler);
                texture.setFloat('numSources', behaviourOptions.shotSources.length);
                texture.setFloat('focused', behaviourOptions.focused ? 1 : 0);
            },
            behaviourOptions.bulletValue
        );

        this.bulletFrame = 0;
        this.shotSourcesNum = behaviourOptions.shotSources.length;
        this.shotSpeed = behaviourOptions.shotSpeed || 20;
        this.firing = true;
    }

    update(deltaS) {
        const updateResult = super.update(deltaS);
        if (updateResult) {
            if (!this.target) {
                return false;
            }

            const [newPositions, newVelocities] = updateResult;

            const sourceOffset = this.parent.getAbsolutePosition();
            const shotVector = this.target.subtract(sourceOffset).normalize().scale(this.shotSpeed);

            newPositions.setFloat('frame', this.bulletFrame);
            newVelocities.setFloat('frame', this.bulletFrame);
            newPositions.setFloat('firing', +(this.firing && !this.disabled));
            newVelocities.setFloat('firing', +(this.firing && !this.disabled));
            newPositions.setFloat('focused', +(!!this.focused));
            newVelocities.setFloat('focused', +(!!this.focused));
            newPositions.setVector3('shotVector', shotVector);
            newVelocities.setVector3('shotVector', shotVector);
            newPositions.setVector3('sourceOffset', sourceOffset);
            newVelocities.setVector3('sourceOffset', sourceOffset);
        }

        if (this.firing && !this.disabled) {
            this.bulletFrame = (this.bulletFrame + 1) % PLAYER_BULLETS_WHEEL_LENGTH;
        }
        return updateResult;
    }
}

export const makePlayerShotBehaviour = (behaviourOptions, environmentCollision, radius, parent) => {
    return new PlayerShotBehaviour(behaviourOptions, environmentCollision, parent);
};
