import { makeItembehaviour } from './ItemBehaviour';
import { makeLinearBehaviour } from './LinearBehaviour';
import { makePlayerShotAccelerationBehaviour } from './PlayerShotAccelerationBehaviour';
import { makePlayerShotBehaviour } from './PlayerShotBehaviour';
import { makePlayerShotTrackingBehaviour } from './PlayerShotTrackingBehaviour';
import { makeSlowToStopBehaviour } from './SlowToStop';

const bulletBehaviourMap = {
    linear: makeLinearBehaviour,
    slowToStop: makeSlowToStopBehaviour,
    item: makeItembehaviour,
    playerShot: makePlayerShotBehaviour,
    playerShotTracking: makePlayerShotTrackingBehaviour,
    playerShotAcceleration: makePlayerShotAccelerationBehaviour,
}

export const makeBulletBehaviour = (behaviourOptions, environmentCollision, radius, parent) => {
    const bulletBehaviourFunction = bulletBehaviourMap[behaviourOptions.behaviour];
    if (!bulletBehaviourFunction) throw new Error('Unsupported bullet behaviour option: ' + behaviourOptions.behaviour);

    return bulletBehaviourFunction(behaviourOptions, environmentCollision, radius, parent)
};
