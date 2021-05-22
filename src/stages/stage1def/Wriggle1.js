import { BULLET_TYPE } from "../../babylon-components/bullets/behaviours/EnemyBulletBehaviour";

export const Wriggle1 = () => {
    const map = {
        isBoss: true,
        movementProps: {
            type: 'empty',
        },
        meshProps: {
            type: 'wriggle',
        },
        behaviourProps: {
            type: 'wriggle1',
        },
        radius: 1,
        health: 4000,
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
                num: 40
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
