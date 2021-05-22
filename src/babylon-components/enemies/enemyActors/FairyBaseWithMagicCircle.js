import { Animation, EasingFunction, SineEase, Vector3 } from '@babylonjs/core';
import React, { useEffect, useRef } from 'react';
import { useScene } from 'react-babylonjs';
import { useName } from '../../hooks/useName';
import { useTexture } from '../../hooks/useTexture';
import { FairyBase } from './FairyBase';

const planePosition = new Vector3(0, 0, 0.5);

export const FairyBaseWithMagicCircle = React.forwardRef(({ ...props }, ref) => {
    const planeRef = useRef();
    const name = useName("fairyBaseWithMagicCircle")
    const texture = useTexture("blueMagicCircle")
    const scene = useScene();

    useEffect(() => {
        const sineAnimation = new Animation(name + "sineAnimation", "scaling", 30, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CYCLE);
        const keysSineAnimation = [];
        keysSineAnimation.push({ frame: 0, value: new Vector3(1, 1, 1) });
        keysSineAnimation.push({ frame: 30, value: new Vector3(2, 2, 2) });
        keysSineAnimation.push({ frame: 60, value: new Vector3(1, 1, 1) });
        sineAnimation.setKeys(keysSineAnimation);

        const cubicEasing = new SineEase();
        cubicEasing.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT)
        sineAnimation.setEasingFunction(cubicEasing);

        planeRef.current.animations.push(sineAnimation);
        scene.beginAnimation(planeRef.current, 0, 60, true);

    }, [name, scene])

    return (
        <transformNode name={name}>
            <plane position={planePosition} ref={planeRef} name={name + 'circlePlane'} width={2} height={2}>
                <standardMaterial useAlphaFromDiffuseTexture backFaceCulling={false} name={name + 'mat'} diffuseTexture={texture} />
            </plane>
            <FairyBase ref={ref} {...props} />
        </transformNode>
    );
});
