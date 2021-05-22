import { rotateVector } from '../../BabylonUtils';
import { globalActorRefs } from '../../gameLogic/StaticRefs';

export const makeMultiAreaPattern = (patternOptions, parent) => {
    let forwardVector;

    if (patternOptions.towardsPlayer) {
        forwardVector = globalActorRefs.player.position.subtract(parent.getAbsolutePosition()).normalize()
    }
    else {
        throw new Error("Area pattern not towards player not implemented yet")
    }

    const angle = patternOptions.radialAngle

    const velocities = [];
    const positions = [];

    patternOptions.speeds.forEach(speed => {
        for (let i = 0; i < patternOptions.num; i++) {
            for (let j = 0; j < patternOptions.num; j++) {
                const xAngle = ((i / (patternOptions.num - 1)) - 0.5) * angle;
                const yAngle = ((j / (patternOptions.num - 1)) - 0.5) * angle;

                const newForward = rotateVector(forwardVector, xAngle, yAngle)
                velocities.push(newForward.scale(speed))
                positions.push(newForward.scale(patternOptions.radius || 1))
            }
        }
    })


    return {
        positions,
        velocities,
    };
};
