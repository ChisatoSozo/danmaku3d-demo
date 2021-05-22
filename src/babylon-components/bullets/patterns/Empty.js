import { Vector3 } from '@babylonjs/core';
import { fill } from 'lodash';

export const makeEmptyPattern = (patternOptions) => {
    let velocities = fill(Array(patternOptions.num), new Vector3(0, 0, 0));
    let positions = fill(Array(patternOptions.num), new Vector3(-510, -510, -510));

    return {
        positions: positions,
        velocities: velocities,
    };
};
