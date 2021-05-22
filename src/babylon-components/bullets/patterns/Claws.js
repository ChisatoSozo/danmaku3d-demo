import { Vector3 } from '@babylonjs/core';
import { times } from 'lodash';
import { RandVector3 } from '../../BabylonUtils';
import { makeArcPattern } from './Arc';

export const makeClawsPattern = (patternOptions, parent) => {

    const outPositions = [];
    const outVelocities = [];
    const outTimings = [];

    for(let i = 0; i < patternOptions.num; i++) {
        const perc = i/(patternOptions.num - 1);
        const from = Vector3.Lerp(new RandVector3(...patternOptions.from1), new RandVector3(...patternOptions.from2), perc);
        const to = Vector3.Lerp(new RandVector3(...patternOptions.to1), new RandVector3(...patternOptions.to2), perc);
        const {positions, velocities} = makeArcPattern({
            pattern: 'arc',
            num: patternOptions.num,
            from,
            to,
            speed: 4 + perc * 4,
            radius: 0
        })
        const timings = times(patternOptions.num, () => perc * 0.1)

        outPositions.push(...positions);
        outVelocities.push(...velocities);
        outTimings.push(...timings);
    }

    return {
        positions: outPositions,
        velocities: outVelocities,
        timings: outTimings
    };
};
