export const RotateAndShootMinionDef = ({ spawn, targetDist = 1, reverse = false, armTime = 1, color=[1, 1, 1]}) => {
    const map = {
        movementProps: {
            type: 'rotate',
            spawn, 
            reverse,
            targetDist,
            armTime
        },
        meshProps:{
            type: 'minion',
        },
        behaviourProps: {
            type: 'stage1Minion',
            color
        },
        radius: 0.5,
        health: 10,
    };

    return map;
};
