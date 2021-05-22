import { BULLET_TYPE } from "../../babylon-components/bullets/behaviours/EnemyBulletBehaviour";

export const Tumbleweed = (spawn, target) => {
    const map = {
        movementProps: {
            type: 'fromTo',
            spawn,
            target
        },
        meshProps: {
            type: 'tumbleweed',
        },
        behaviourProps: {
            type: 'tumbleweed',
        },

        radius: 0.8,
        health: 2,
        deathInstruction: {
            type: 'shoot',
            materialOptions: {
                material: 'item',
                texture: 'point',
                doubleSided: true,
                hasAlpha: true,
            },
            patternOptions: {
                pattern: 'single',
                position: [0, 0, 0],
                velocity: [
                    [-1, 1],
                    [-1, 1],
                    [-1, 1],
                ],
                disablePrecomputation: true,
            },
            meshOptions: {
                mesh: 'item',
            },
            behaviourOptions: {
                behaviour: 'item',
                bulletType: BULLET_TYPE.POINT,
            },
            soundOptions: {
                mute: true
            },
            lifespan: 10,
            wait: 0,
        }
    };

    return map;
};
