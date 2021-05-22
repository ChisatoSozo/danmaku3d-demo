import { glsl } from '../../BabylonUtils';
import { collisionSnippet, mainHeaderSnippet, postVelocityComputeSnippet, uniformSnippet } from './Common';
import { EnemyBulletBehaviour } from './EnemyBulletBehaviour';

export const slowToStopBehaviourPositionPixelShader = glsl`
    ${uniformSnippet}

    void main()	{
        ${mainHeaderSnippet}

        vec4 out_Position = vec4( position + (velocity * delta), 1.);

        ${collisionSnippet}
        
        gl_FragColor = out_Position;
    }
`;

export const slowToStopBehaviourVelocityPixelShader = glsl`
    ${uniformSnippet}
    uniform float _delay;
    uniform float batchNumber;

    void main() {
        ${mainHeaderSnippet}

        velocity = velocity * (1. - delta);

        ${postVelocityComputeSnippet}
        vec4 out_Velocity = vec4( velocity, 1.);

        gl_FragColor = out_Velocity;
    }
`;

class SlowToStopBehaviour extends EnemyBulletBehaviour {
    constructor(environmentCollision, radius, parent) {
        super('slowToStopBehaviourPosition', 'slowToStopBehaviourVelocity', parent, environmentCollision, null, radius);
    }
}

export const makeSlowToStopBehaviour = (behaviourOptions, environmentCollision, radius, parent) => {
    return new SlowToStopBehaviour(environmentCollision, radius, parent);
};
