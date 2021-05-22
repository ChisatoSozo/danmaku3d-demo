import { Animation } from '@babylonjs/core';
import React, { useContext, useMemo, useRef } from 'react';
import { randVectorToPosition } from '../../BabylonUtils';
import { AnimationContext } from '../../gameLogic/GeneralContainer';
import { useDoSequence } from '../../hooks/useDoSequence';
import { useName } from '../../hooks/useName';


export const FromToMovement = ({ children, spawn, target }) => {
    const transformNodeRef = useRef();
    const startPosition = useMemo(() => randVectorToPosition(spawn), [spawn]);
    const targetPosition = useMemo(() => randVectorToPosition(target), [target]);
    const { registerAnimation } = useContext(AnimationContext);
    const name = useName("AppearMoveMovement")

    const actionsTimings = useMemo(() => [0], []);

    const actions = useMemo(
        () => [
            () => {
                registerAnimation(
                    Animation.CreateAndStartAnimation(
                        'anim',
                        transformNodeRef.current,
                        'position',
                        1,
                        5,
                        transformNodeRef.current.position,
                        targetPosition,
                        0
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
