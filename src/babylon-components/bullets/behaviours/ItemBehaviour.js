import { ARENA_LENGTH } from '../../../utils/Constants';
import { glsl } from '../../BabylonUtils';
import { collisionSnippet, mainHeaderSnippet, uniformSnippet } from './Common';
import { EnemyBulletBehaviour } from './EnemyBulletBehaviour';

export const itemBehaviourPositionPixelShader = glsl`
    ${uniformSnippet}

    void main()	{
        ${mainHeaderSnippet}

        vec4 out_Position = vec4( position + (velocity * delta), 1.);

        ${collisionSnippet}
        
        gl_FragColor = out_Position;
    }
`;

export const itemBehaviourVelocityPixelShader = glsl`
    uniform float delta;
    uniform vec2 resolution;
    uniform vec3 playerPosition;
    uniform sampler2D positionSampler;
    uniform sampler2D velocitySampler;

    void main() {
        vec2 uv = gl_FragCoord.xy / resolution;
        vec3 instPos = texture2D( positionSampler, uv ).xyz;
        vec3 instVel = texture2D( velocitySampler, uv ).xyz;
        instVel.xy = instVel.xy * .98;
        instVel.z = instVel.z + (-5. - instVel.z) * .05;

        float closeToPlayer = float(distance(instPos, playerPosition) < 4.) * float(instPos.z < ${-ARENA_LENGTH / 2 + 2}.);
        float notCloseToPlayer = 1. - closeToPlayer;

        vec3 towardsPlayer = normalize(playerPosition - instPos);

        gl_FragColor = vec4(instVel, 1.) * notCloseToPlayer + vec4(towardsPlayer * 6., 1.) * closeToPlayer;
    }
`;

class Itembehaviour extends EnemyBulletBehaviour {
    constructor(bulletType, bulletValue, environmentCollision, radius, parent) {
        super('itemBehaviourPosition', 'itemBehaviourVelocity', parent, environmentCollision, null, radius, bulletType || 4, bulletValue || 1);
    }
}

export const makeItembehaviour = (behaviourOptions, environmentCollision, radius, parent) => {
    return new Itembehaviour(behaviourOptions.bulletType, behaviourOptions.bulletValue, environmentCollision, radius, parent);
};
