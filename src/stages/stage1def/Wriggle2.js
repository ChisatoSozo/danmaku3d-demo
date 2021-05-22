import { BULLET_TYPE } from "../../babylon-components/bullets/behaviours/EnemyBulletBehaviour";

export const Wriggle2 = () => {
    const map = {
        isBoss: true,
        movementProps: {
            type: 'empty',
        },
        meshProps: {
            type: 'wriggle',
        },
        behaviourProps: {
            type: 'wriggle2',
        },

        radius: 1,
        health: 18000,
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
