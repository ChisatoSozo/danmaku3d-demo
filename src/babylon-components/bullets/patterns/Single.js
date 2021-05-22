import { RandVector3 } from '../../BabylonUtils';
import { globalActorRefs } from '../../gameLogic/StaticRefs';

export const makeSinglePattern = (patternOptions, parent) => {
    let velocity;
    let position;

    if (patternOptions.towardsPlayer) {
        const speed = patternOptions.speed || 1;
        velocity = globalActorRefs.player.position.subtract(parent.getAbsolutePosition()).normalize().scale(speed);
        position = new RandVector3(...patternOptions.position);
    } else {
        velocity = new RandVector3(...patternOptions.velocity);
        position = new RandVector3(...patternOptions.position);
    }

    return {
        positions: [position],
        velocities: [velocity],
    };
};
