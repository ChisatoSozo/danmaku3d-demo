import { BULLET_TYPE } from "../../../bullets/behaviours/EnemyBulletBehaviour";

export const playerDeathInstruction = (power) => ({
    type: 'shoot',
    materialOptions: {
        material: 'item',
        texture: 'power',
        doubleSided: true,
        hasAlpha: true,
    },
    patternOptions: {
        pattern: 'arc',
        num: 7,
        from: [1, 0, 10],
        to: [-1, 0, 10],
        speed: 80,
        radius: 5
    },
    meshOptions: {
        mesh: 'item',
    },
    behaviourOptions: {
        behaviour: 'item',
        bulletType: BULLET_TYPE.POWER,
        bulletValue: power / 8
    },
    lifespan: 20,
    wait: 0,
})

export const playerContinueInstruction = () => ({
    type: 'shoot',
    materialOptions: {
        material: 'item',
        texture: 'fullpower',
        doubleSided: true,
        hasAlpha: true,
    },
    patternOptions: {
        pattern: 'arc',
        num: 7,
        from: [1, 0, 10],
        to: [-1, 0, 10],
        speed: 80,
        radius: 5
    },
    meshOptions: {
        mesh: 'item',
    },
    behaviourOptions: {
        behaviour: 'item',
        bulletType: BULLET_TYPE.POWER,
        bulletValue: 120
    },
    lifespan: 20,
    wait: 0,
})