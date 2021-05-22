import { BULLET_TYPE } from "../../babylon-components/bullets/behaviours/EnemyBulletBehaviour";

export const DefaultFairy = (spawn, target) => {
    const map = {
        radius: 0.5,
        health: 2,
        movementProps: {
            type: 'agroThenAfraid',
            spawn: spawn,
        },
        behaviourProps: {
            type: 'defaultFairy',
        },
        meshProps: {
            type: 'fairy',
            asset: 'blueFairy',
        },

        deathInstruction: {
            type: 'shoot',
            materialOptions: {
                material: 'item',
                texture: 'power',
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
                bulletType: BULLET_TYPE.POWER,
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
