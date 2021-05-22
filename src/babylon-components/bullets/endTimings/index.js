import { times } from "lodash";
import { preComputedEndTimings, preComputedEndTimingsTextures } from "../../gameLogic/StaticRefs";
import { makeTextureFromArray } from "../BulletUtils";

export const makeEndTimings = (endTimingsInstruction, lifespan, num, scene) => {
    let endTimings = [];

    const uid = endTimingsInstruction.uid || JSON.stringify({ endTimingsInstruction, lifespan, num })

    const precomputedEndTiming = preComputedEndTimings[uid];
    if (precomputedEndTiming) {
        return precomputedEndTiming;
    }

    let _timings;

    switch (endTimingsInstruction.timing) {
        case "lifespan":
            const timing = lifespan === Infinity ? 8000000 : lifespan;
            _timings = times(num, () => timing);
            break;
        case "batch":
            endTimingsInstruction.times.forEach(time => {
                endTimings.push(...times(num / endTimingsInstruction.times.length, () => time))
            })
            _timings = endTimings;
            break;
        case "uniform":
            _timings = times(num, () => endTimingsInstruction.time)
            break;
        default:
            throw new Error('invalid end timing type ' + endTimingsInstruction.timing)
    }

    if (!precomputedEndTiming) {
        preComputedEndTimings[uid] = _timings;
        preComputedEndTimingsTextures[uid] = makeTextureFromArray(_timings, scene)
    }
    return _timings;
}