import { Animation, EasingFunction, SineEase, Vector3 } from '@babylonjs/core';
import React, { useEffect, useRef } from 'react';
import { useScene } from 'react-babylonjs';
import { useAssets } from '../../../../hooks/useAssets';

export const Broomstick = (props) => {
    const transformNodeRef = useRef();
    const broomstick = useAssets("broomstick")
    const scene = useScene();

    useEffect(() => {
        if (!broomstick || !transformNodeRef.current) return;

        broomstick.position = new Vector3(0, 0, -0.3);
        broomstick.parent = transformNodeRef.current;

        const sineAnimation = new Animation("broomstickAnimation", "position", 30, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CYCLE);
        const keysSineAnimation = [];
        keysSineAnimation.push({ frame: 0, value: new Vector3(0, 0.01, 0) });
        keysSineAnimation.push({ frame: 53, value: new Vector3(0, -0.01, 0) });
        keysSineAnimation.push({ frame: 106, value: new Vector3(0, 0.01, 0) });
        sineAnimation.setKeys(keysSineAnimation);

        const cubicEasing = new SineEase();
        cubicEasing.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT)
        sineAnimation.setEasingFunction(cubicEasing);

        broomstick.animations.push(sineAnimation);
        scene.beginAnimation(broomstick, 0, 106, true);
    }, [broomstick, scene])

    return (
        <transformNode name="broomstick" ref={transformNodeRef} {...props} />
    )
}
