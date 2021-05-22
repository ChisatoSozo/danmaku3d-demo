import { Vector3 } from '@babylonjs/core';
import { RandVector3 } from '../../BabylonUtils';

export const makeMultiArcPattern = (patternOptions, parent) => {

    let from, to;

    if (patternOptions.from instanceof Vector3) {
        from = patternOptions.from;
        to = patternOptions.to;
    }
    else {
        from = new RandVector3(...patternOptions.from);
        to = new RandVector3(...patternOptions.to);
    }

    const positions = [];
    const velocities = [];

    patternOptions.speeds.forEach(speed => {
        for (let i = 0; i < patternOptions.num; i++) {
            const perc = i / (patternOptions.num - 1);

            const newForward = Vector3.Lerp(from, to, perc)
            newForward.normalize();
            velocities.push(newForward.scale(speed))
            positions.push(newForward.scale(patternOptions.radius || 1))
        }
    })

    return {
        positions,
        velocities,
    };
};
