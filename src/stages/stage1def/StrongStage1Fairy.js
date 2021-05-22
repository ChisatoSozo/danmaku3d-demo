import { BULLET_TYPE } from "../../babylon-components/bullets/behaviours/EnemyBulletBehaviour";

export const StrongStage1Fairy = (spawn, target) => {
    const map = {
        movementProps: {
            type: 'empty',
        },
        meshProps: {
            type: 'fairyWithMagicCircle',
            asset: 'greenHatFairy',
        },
        behaviourProps: {
            type: 'strongStage1Fairy',
            spawn: spawn,
            target: target,
        },
        radius: 0.5,
        health: 50,
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
