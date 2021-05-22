import { Animation, Vector3 } from '@babylonjs/core';
import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { minionSpawn } from '../../../sounds/SFX';
import { zVector } from '../../../utils/Constants';
import { randVectorToPosition } from '../../BabylonUtils';
import { AnimationContext } from '../../gameLogic/GeneralContainer';
import { useName } from '../../hooks/useName';

export const RotateMovement = ({ children, spawn, targetDist, reverse, armTime, rotationAxis = zVector, rotationSpeed = 1 }) => {
    const rotateAroundRef = useRef()
    const armRef = useRef();
    const name = useName('RotateMovement')
    const armStartPosition = useMemo(() => randVectorToPosition(spawn), [spawn])
    const startPosition = useMemo(() => new Vector3(0, 0, 0), [])
    const { registerAnimation } = useContext(AnimationContext);

    useEffect(() => {
        minionSpawn.play()
        registerAnimation(Animation.CreateAndStartAnimation(
            'anim',
            armRef.current,
            'position',
            1,
            armTime || 1,
            armStartPosition,
            armRef.current.position.normalize().scale(targetDist),
            0,
        ))

        registerAnimation(Animation.CreateAndStartAnimation(
            name + "anim",
            rotateAroundRef.current,
            'rotation',
            rotationSpeed,
            4,
            new Vector3(0, 0, 0),
            rotationAxis.scale(reverse ? Math.PI * 2 : -Math.PI * 2),
            Animation.ANIMATIONLOOPMODE_CYCLE,
        ))
    }, [name, targetDist, armStartPosition, reverse, armTime, rotationAxis, rotationSpeed, registerAnimation])

    return (
        <transformNode name={name + "rotateAround"} position={startPosition} ref={rotateAroundRef}>
            <transformNode name={name + "arm"} position={armStartPosition} ref={armRef}>
                {children}
            </transformNode>
        </transformNode>
    )
}
