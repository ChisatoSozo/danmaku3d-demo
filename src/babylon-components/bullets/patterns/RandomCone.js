import { RandVector3, rotateVector } from '../../BabylonUtils';
import { globalActorRefs } from '../../gameLogic/StaticRefs';

export const makeRandomConePattern = (patternOptions, parent) => {
    let forwardVectors = [];

    if (patternOptions.towardsPlayer) {
        forwardVectors = [globalActorRefs.player.position.subtract(parent.getAbsolutePosition()).normalize()]
    }
    else {
        if (!patternOptions.forwardVectors) throw new Error("Pattern requires an array of forwardVectors")
        patternOptions.forwardVectors.forEach(vector => {
            forwardVectors.push(new RandVector3(...vector).normalize())
        })
    }

    const angle = patternOptions.radialAngle

    const velocities = [];
    const positions = [];
    const timings = [];

    forwardVectors.forEach(forwardVector => {
        for (let i = 0; i < patternOptions.num; i++) {
            const perc = (i / (patternOptions.num - 1))

            const xAngle = (Math.random() - 0.5) * angle * perc;
            const yAngle = (Math.random() - 0.5) * angle * perc;

            const newForward = rotateVector(forwardVector, xAngle, yAngle)
            velocities.push(forwardVector.scale(patternOptions.speed || 1).scale(1 - (perc / 2)))
            positions.push(newForward.scale(patternOptions.radius || 1))
            timings.push(perc / 2)
        }
    })


    return {
        positions,
        velocities,
        timings
    };
};
