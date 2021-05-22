import { Effect } from '@babylonjs/core';
import { enemyBulletCollisionPixelShader, playerBulletCollisionPixelShader } from './bullets/behaviours/Common';
import { itemBehaviourPositionPixelShader, itemBehaviourVelocityPixelShader } from './bullets/behaviours/ItemBehaviour';
import { linearBehaviourPositionPixelShader, linearBehaviourVelocityPixelShader } from './bullets/behaviours/LinearBehaviour';
import {
    playerShotBehaviourPositionPixelShader,
    playerShotBehaviourVelocityPixelShader,
} from './bullets/behaviours/PlayerShotBehaviour';
import { addReducerPixelShader } from './bullets/BulletUtils';
import { fresnelVertexShader, fresnelFragmentShader } from './bullets/materials/Fresnel';
import { textureFragmentShader, textureVertexShader } from './bullets/materials/Texture';
import { itemFragmentShader, itemVertexShader } from './bullets/materials/Item';
import {
    playerShotTrackingBehaviourPositionPixelShader,
    playerShotTrackingBehaviourVelocityPixelShader,
} from './bullets/behaviours/PlayerShotTrackingBehaviour';
import { debugFragmentShader, debugVertexShader } from './bullets/materials/Debug';
import { slowToStopBehaviourPositionPixelShader, slowToStopBehaviourVelocityPixelShader } from './bullets/behaviours/SlowToStop';
import { actorFresnelFragmentShader, actorFresnelVertexShader } from './enemies/enemyActors/materials/ActorFresnel';
import { playerShotAccelerationBehaviourPositionPixelShader, playerShotAccelerationBehaviourVelocityPixelShader } from './bullets/behaviours/PlayerShotAccelerationBehaviour';

Effect.ShadersStore['actorFresnelVertexShader'] = actorFresnelVertexShader;
Effect.ShadersStore['actorFresnelFragmentShader'] = actorFresnelFragmentShader;


Effect.ShadersStore['addReducerPixelShader'] = addReducerPixelShader;

Effect.ShadersStore['playerBulletCollisionPixelShader'] = playerBulletCollisionPixelShader;
Effect.ShadersStore['enemyBulletCollisionPixelShader'] = enemyBulletCollisionPixelShader;

Effect.ShadersStore['linearBehaviourPositionPixelShader'] = linearBehaviourPositionPixelShader;
Effect.ShadersStore['linearBehaviourVelocityPixelShader'] = linearBehaviourVelocityPixelShader;

Effect.ShadersStore['slowToStopBehaviourPositionPixelShader'] = slowToStopBehaviourPositionPixelShader;
Effect.ShadersStore['slowToStopBehaviourVelocityPixelShader'] = slowToStopBehaviourVelocityPixelShader;

Effect.ShadersStore['itemBehaviourPositionPixelShader'] = itemBehaviourPositionPixelShader;
Effect.ShadersStore['itemBehaviourVelocityPixelShader'] = itemBehaviourVelocityPixelShader;

Effect.ShadersStore['playerShotBehaviourPositionPixelShader'] = playerShotBehaviourPositionPixelShader;
Effect.ShadersStore['playerShotBehaviourVelocityPixelShader'] = playerShotBehaviourVelocityPixelShader;

Effect.ShadersStore['playerShotTrackingBehaviourPositionPixelShader'] = playerShotTrackingBehaviourPositionPixelShader;
Effect.ShadersStore['playerShotTrackingBehaviourVelocityPixelShader'] = playerShotTrackingBehaviourVelocityPixelShader;

Effect.ShadersStore['playerShotAccelerationBehaviourPositionPixelShader'] = playerShotAccelerationBehaviourPositionPixelShader;
Effect.ShadersStore['playerShotAccelerationBehaviourVelocityPixelShader'] = playerShotAccelerationBehaviourVelocityPixelShader;

Effect.ShadersStore['fresnelVertexShader'] = fresnelVertexShader;
Effect.ShadersStore['fresnelFragmentShader'] = fresnelFragmentShader;

Effect.ShadersStore['debugVertexShader'] = debugVertexShader;
Effect.ShadersStore['debugFragmentShader'] = debugFragmentShader;

Effect.ShadersStore['textureVertexShader'] = textureVertexShader;
Effect.ShadersStore['textureFragmentShader'] = textureFragmentShader;

Effect.ShadersStore['itemVertexShader'] = itemVertexShader;
Effect.ShadersStore['itemFragmentShader'] = itemFragmentShader;

//for glsl lint
const glsl = (x) => x;

Effect.ShadersStore['SpriteSheetPixelShader'] = glsl`
    varying vec2 vUV;
    uniform sampler2D spriteSheetTexture;
    uniform vec2 spriteSheetSize;
    uniform vec2 spriteSheetOffset;
    uniform vec2 spriteSize;
    uniform float frame;

    void main(void) {
        float w = spriteSheetSize.x;
        float h = spriteSheetSize.y;

        float x = spriteSheetOffset.x / w;
        float y = spriteSheetOffset.y / h;

        float dx = spriteSize.x / w;
        float dy = spriteSize.y / h;

        float u = x + dx * frame;
        float v = 1. - y;

        float uvx = vUV.x * dx + u;
        float uvy = 1. - dy + 1. - y + dy*vUV.y;
        vec2 uv = vec2(uvx, uvy);

        gl_FragColor = texture2D(spriteSheetTexture, uv);
    }
`;
