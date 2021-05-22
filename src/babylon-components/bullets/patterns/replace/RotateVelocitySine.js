import { Vector3 } from "@babylonjs/core";
import { sum } from "../../../../utils/Utils";
import { allBullets, preComputedBulletPatterns, preComputedEndTimings } from "../../../gameLogic/StaticRefs";

export const makeRotateSineVelocityReplacement = (patternOptions, parent) => {
    const sourcePattern = preComputedBulletPatterns[patternOptions.sourceUid];
    if (!sourcePattern) throw new Error("source pattern not found " + patternOptions.sourceUid);
    const sourceEndTimings = preComputedEndTimings[patternOptions.sourceUid];
    if (!sourceEndTimings) throw new Error("source endTimings not found " + patternOptions.sourceUid);

    const forward = patternOptions.forward
    if (!forward) throw new Error("forward not defined");

    const right = forward.cross(Vector3.Up());
    const up = forward.cross(right);

    const velocities = sourcePattern.velocities.map((velocity, i) => {
        const alter = right.scale(Math.sin(i * Math.PI / 8)).add(up.scale(Math.cos(i * Math.PI / 8)))
        return alter.add(forward).scale(patternOptions.speed || 1);
    });

    const timings = sum(sourceEndTimings, sourcePattern.timings);

    return { velocities, timings }
}

export const fulfilRotateSineVelocityReplacement = (patternOptions, parent) => {
    const _pattern = preComputedBulletPatterns[patternOptions.uid]
    _pattern.positions = allBullets[patternOptions.sourceBulletId].behaviour.diffSystem.positionTextures[0];
    return _pattern;
}