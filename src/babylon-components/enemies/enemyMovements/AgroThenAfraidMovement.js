import { Animation, BezierCurveEase } from '@babylonjs/core';
import React, { useContext, useMemo, useRef } from 'react';
import { randVectorToPosition } from '../../BabylonUtils';
import { AnimationContext } from '../../gameLogic/GeneralContainer';
import { globalActorRefs } from '../../gameLogic/StaticRefs';
import { useDoSequence } from '../../hooks/useDoSequence';
import { useName } from '../../hooks/useName';


export const AgroThenAfraidMovement = ({ children, spawn }) => {
    const transformNodeRef = useRef();
    const startPosition = useMemo(() => randVectorToPosition(spawn), [spawn]);
    const { registerAnimation } = useContext(AnimationContext);
    const name = useName("AgroThenAfraidMovement")

    const actionsTimings = useMemo(() => [0, 2], []);

    const actions = useMemo(
        () => [
            () => {
                const transform = transformNodeRef.current;
                const target = globalActorRefs.player.position.scale(1.2).add(startPosition.scale(0.8)).scale(0.5);
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
                const target = transform.position.add(
                    transform.position.subtract(globalActorRefs.player.position).normalize().scale(20)
                );
                target.y = transform.position.y;
                const easingFunction = new BezierCurveEase(0.64, 0.24, 0.87, 0.41);
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
                        easingFunction
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
