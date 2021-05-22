import { Animation, BezierCurveEase } from "@babylonjs/core";
import { randVectorToPosition } from "../../BabylonUtils";

export const moveTo = (registerAnimation, transform, target) => {
    const targetVector = randVectorToPosition(target);
    let easingFunction = new BezierCurveEase(0.03, 0.66, 0.72, 0.98);
    registerAnimation(
        Animation.CreateAndStartAnimation(
            'anim',
            transform,
            'position',
            1,
            1,
            transform.position,
            targetVector,
            0,
            easingFunction
        )
    );
}