import { randScalar } from '../../BabylonUtils';
import * as BulletVectorFunctions from './BulletVectorFunctions';

export const makeBurstPattern = (patternOptions) => {
    const speed = randScalar(patternOptions.speed);
    let velocities = BulletVectorFunctions.burst(patternOptions.num, speed, patternOptions.thetaStart, patternOptions.thetaLength, patternOptions.startY, patternOptions.yLength);

    const radius = patternOptions.radius || 0;
    let positions = BulletVectorFunctions.burst(patternOptions.num, radius, patternOptions.thetaStart, patternOptions.thetaLength, patternOptions.startY, patternOptions.yLength);

    return {
        positions: positions,
        velocities: velocities,
    };
};
