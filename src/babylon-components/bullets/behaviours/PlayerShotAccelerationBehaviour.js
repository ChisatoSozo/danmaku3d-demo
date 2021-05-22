import { Vector3 } from '@babylonjs/core';
import { PLAYER_BULLETS_WHEEL_LENGTH } from '../../../utils/Constants';
import { glsl, RandVector3 } from '../../BabylonUtils';
import { makeTextureFromVectors } from '../BulletUtils';
import { collisionSnippet, mainHeaderSnippet, uniformSnippet } from './Common';
import { PlayerBulletBehaviour } from './PlayerBulletBehaviour';

export const playerShotAccelerationBehaviourPositionPixelShader = glsl`
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

export const playerShotAccelerationBehaviourVelocityPixelShader = glsl`
    ${uniformSnippet}

    uniform float firing;
    uniform float frame;
    uniform float numSources;
    uniform vec3 shotVector;


    void main() {
        ${mainHeaderSnippet}

        float currentWindowStart = frame * numSources;
        float currentWindowEnd = currentWindowStart + numSources;

        float bulletEnabled = float((id > (currentWindowStart - 0.1)) && (id < (currentWindowEnd - 0.1))) * firing;
        float bulletNotEnabled = 1. - bulletEnabled;

        velocity = velocity + (vec3(0., 0., 50.) * delta);

        gl_FragColor = vec4((bulletNotEnabled * velocity) + (bulletEnabled * shotVector), 1.);
    }
`;

class PlayerShotAccelerationBehaviour extends PlayerBulletBehaviour {
    constructor(behaviourOptions, environmentCollision, parent) {
        const sourceSampler = makeTextureFromVectors(behaviourOptions.shotSources);

        super(
            'playerShotAccelerationBehaviourPosition',
            'playerShotAccelerationBehaviourVelocity',
            parent,
            environmentCollision,
            (texture) => {
                texture.setFloat('frame', 0.001);
                texture.setFloat('firing', 0);
                texture.setVector3('shotVector', new RandVector3(...behaviourOptions.initialShotVector));
                texture.setVector3('sourceOffset', new Vector3(0, 0, 0));
                texture.setTexture('sourceSampler', sourceSampler);
                texture.setFloat('numSources', behaviourOptions.shotSources.length);
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

            newPositions.setFloat('frame', this.bulletFrame);
            newVelocities.setFloat('frame', this.bulletFrame);
            newPositions.setFloat('firing', +(this.firing && !this.disabled));
            newVelocities.setFloat('firing', +(this.firing && !this.disabled));
            newPositions.setVector3('sourceOffset', sourceOffset);
            newVelocities.setVector3('sourceOffset', sourceOffset);
        }
        if (this.firing && !this.disabled) {
            this.bulletFrame = (this.bulletFrame + 1) % PLAYER_BULLETS_WHEEL_LENGTH;
        }
        return updateResult;
    }
}

export const makePlayerShotAccelerationBehaviour = (behaviourOptions, environmentCollision, radius, parent) => {
    return new PlayerShotAccelerationBehaviour(behaviourOptions, environmentCollision, parent);
};
