export const InertOrbitMinionDef = (spawn) => {
    const map = {
        movementProps: {
            type: 'rotate',
            spawn: spawn, 
            targetDist: 1,
        },
        meshProps:{
            type: 'minion',
        },
        behaviourProps: {
            type: 'inertMinion',
        },
        radius: 0.5,
        health: 10,
    };

    return map;
};
