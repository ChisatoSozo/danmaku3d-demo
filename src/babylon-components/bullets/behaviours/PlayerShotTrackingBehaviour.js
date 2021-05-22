import { Vector3 } from '@babylonjs/core';
import { MAX_ENEMIES, PLAYER_BULLETS_WHEEL_LENGTH } from '../../../utils/Constants';
import { glsl, RandVector3 } from '../../BabylonUtils';
import { makeTextureFromVectors } from '../BulletUtils';
import { collisionSnippet, mainHeaderSnippet, uniformSnippet } from './Common';
import { PlayerBulletBehaviour } from './PlayerBulletBehaviour';

export const playerShotTrackingBehaviourPositionPixelShader = glsl`
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

export const playerShotTrackingBehaviourVelocityPixelShader = glsl`
    ${uniformSnippet}

    uniform float firing;
    uniform float frame;
    uniform float numSources;
    uniform vec3 shotVector;
    uniform float enemyPositions[${MAX_ENEMIES * 3}];


    void main() {
        ${mainHeaderSnippet}

        float currentWindowStart = frame * numSources;
        float currentWindowEnd = currentWindowStart + numSources;

        float bulletEnabled = float((id > (currentWindowStart - 0.1)) && (id < (currentWindowEnd - 0.1))) * firing;
        float bulletNotEnabled = 1. - bulletEnabled;

        vec3 closestPosition = vec3(-500., -500., -500.);
        float closestDistance = 500.;

        //mutate velocity
        for(int i = 0; i < ${MAX_ENEMIES}; i ++){
            int offset = i * 3;
            vec3 enemyPosition = vec3(enemyPositions[offset],enemyPositions[offset + 1], enemyPositions[offset + 2]);
            float enemyBulletDistance = distance(position, enemyPosition);

            float newClosest = float(enemyBulletDistance < closestDistance);
            float notNewClosest = 1. - newClosest;

            closestPosition = closestPosition * notNewClosest + enemyPosition * newClosest;
            closestDistance = min(closestDistance, enemyBulletDistance);
        }

        vec3 towardsEnemy = (closestPosition - position) + vec3(0.01, 0.01, 0.01);
        vec3 towardsEnemyN = normalize(towardsEnemy);
        vec3 mutatedVelocity = (velocity.xyz * (1. - delta * 10.)) + (towardsEnemyN * delta * 100.);

        float newClosest = float(closestPosition.x > -250.);
        float notNewClosest = 1. - newClosest;

        velocity = newClosest * mutatedVelocity + notNewClosest * velocity;

        gl_FragColor = vec4((bulletNotEnabled * velocity) + (bulletEnabled * shotVector), 1.);
    }
`;

class PlayerShotTrackingBehaviour extends PlayerBulletBehaviour {
    constructor(behaviourOptions, environmentCollision, parent) {
        const sourceSampler = makeTextureFromVectors(behaviourOptions.shotSources);

        super(
            'playerShotTrackingBehaviourPosition',
            'playerShotTrackingBehaviourVelocity',
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

export const makePlayerShotTrackingBehaviour = (behaviourOptions, environmentCollision, radius, parent) => {
    return new PlayerShotTrackingBehaviour(behaviourOptions, environmentCollision, parent);
};
