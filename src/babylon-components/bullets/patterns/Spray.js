import { times } from 'lodash';
import * as BulletVectorFunctions from './BulletVectorFunctions';

export const makeSprayPattern = (patternOptions) => {
    let velocities = [];
    let positions = [];
    let timings = [];

    const burstPerSecond = patternOptions.burstPerSecond || 8;

    for (let i = 0; i < burstPerSecond * patternOptions.timeLength; i++) {
        const speed = patternOptions.speed || 4;
        const perc = i / 8;
        const thetaStart = perc * Math.PI / 8 * (patternOptions.thetaSpeed || 1);
        velocities.push(...BulletVectorFunctions.burst(patternOptions.num, speed, thetaStart, patternOptions.thetaLength, patternOptions.startY, patternOptions.yLength));

        const radius = patternOptions.radius || 0;
        positions.push(...BulletVectorFunctions.burst(patternOptions.num, radius, thetaStart, patternOptions.thetaLength, patternOptions.startY, patternOptions.yLength));

        const time = i / burstPerSecond;
        timings.push(...times(patternOptions.num, () => time))
    }

    return {
        positions,
        velocities,
        timings
    };
};
