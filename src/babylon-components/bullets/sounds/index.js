import * as SFX from "../../../sounds/SFX"
import { filterInPlace } from "../../../utils/Utils";

class EnemySound {
    constructor(soundObj, reducedTimings){
        this.soundObj = soundObj;
        this.reducedTimings = reducedTimings;
        this.timeSinceStart = 0;
    }

    update(deltaS){
        this.timeSinceStart += deltaS;
        
        this.reducedTimings.some((timing) => {
            if (this.timeSinceStart > timing) {
                this.soundObj.play();
                return false;
            }
            return true;
        });

        filterInPlace(this.reducedTimings, (timing) => this.timeSinceStart <= timing);
    }
}

export const makeBulletSound = (soundOptions, timings) => {
    const reducedTimings = [...(new Set(timings))].sort(
        (a, b) => (a - b)
    )

    const soundObj = SFX[soundOptions.sound]

    return new EnemySound(soundObj, reducedTimings)
}