import { Animation, BezierCurveEase, Vector3 } from '@babylonjs/core';
import React, { useContext, useMemo, useRef } from 'react';
import { randVectorToPosition } from '../../BabylonUtils';
import { AnimationContext } from '../../gameLogic/GeneralContainer';
import { useDoSequence } from '../../hooks/useDoSequence';
import { useName } from '../../hooks/useName';


export const AppearMoveMovement = ({ children, spawn, target }) => {
    const transformNodeRef = useRef();
    const startPosition = useMemo(() => randVectorToPosition(spawn), [spawn]);
    const targetPosition = useMemo(() => randVectorToPosition(target), [target]);
    const { registerAnimation } = useContext(AnimationContext);
    const name = useName("AppearMoveMovement")

    const actionsTimings = useMemo(() => [0, 2.5], []);

    const actions = useMemo(
        () => [
            () => {
                const transform = transformNodeRef.current;
                const target = startPosition.add(new Vector3(0, 0, -4));
                let easingFunction = new BezierCurveEase(0.03, 0.66, 0.72, 0.98);
                registerAnimation(
                    Animation.CreateAndStartAnimation(
                        'anim',
                        transform,
                        'position',
                        1,
                        2,
                        transform.position,
                        target,
                        0,
                        easingFunction
                    )
                );
            },
            () => {
                const transform = transformNodeRef.current;
                const target = targetPosition
                registerAnimation(
                    Animation.CreateAndStartAnimation(
                        'anim',
                        transform,
                        'position',
                        1,
                        5,
                        transform.position,
                        target,
                        0,
                    )
                );
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    useDoSequence(true, transformNodeRef, actionsTimings, actions);

    return (
        <transformNode name = {name} position={startPosition} ref={transformNodeRef}>
            {children}
        </transformNode>
    );
};
