import { BULLET_TYPE } from "../../babylon-components/bullets/behaviours/EnemyBulletBehaviour";

export const StrongerStage1Fairy = (spawn, target) => {
    const map = {
        movementProps: {
            type: 'appearMove',
            spawn: spawn,
            target: target,
        },
        meshProps: {
            type: 'fairyWithMagicCircle',
            asset: 'greenHatFairy',
        },
        behaviourProps: {
            type: 'strongerStage1Fairy',
        },
        radius: 0.5,
        health: 80,

        deathInstruction: {
            type: 'shoot',
            materialOptions: {
                material: 'item',
                texture: 'power',
                doubleSided: true,
                hasAlpha: true,
            },
            patternOptions: {
                pattern: 'burst',
                num: 3
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
