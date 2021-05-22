import { sum } from "../../../../utils/Utils";
import { rotateVector } from "../../../BabylonUtils";
import { allBullets, preComputedBulletPatterns, preComputedEndTimings } from "../../../gameLogic/StaticRefs";

export const makeRotateVelocityReplacement = (patternOptions, parent) => {
    const sourcePattern = preComputedBulletPatterns[patternOptions.sourceUid];
    if (!sourcePattern) throw new Error("source pattern not found " + patternOptions.sourceUid);
    const sourceEndTimings = preComputedEndTimings[patternOptions.sourceUid];
    if (!sourceEndTimings) throw new Error("source endTimings not found " + patternOptions.sourceUid);

    const velocities = sourcePattern.velocities.map(velocity => {
        return rotateVector(velocity, patternOptions.rotation || 0, 0, 0).scale(patternOptions.velocityMultiplier || 1);
    });
    const timings = sum(sourceEndTimings, sourcePattern.timings);

    return { velocities, timings }
}

export const fulfilRotateVelocityReplacement = (patternOptions, parent) => {
    const _pattern = preComputedBulletPatterns[patternOptions.uid]
    _pattern.positions = allBullets[patternOptions.sourceBulletId].behaviour.diffSystem.positionTextures[0];
    return _pattern;
}