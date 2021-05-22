import { Vector3 } from '@babylonjs/core';
import React, { useMemo, useRef } from 'react';
import { useAddBulletGroup } from '../../hooks/useAddBulletGroup';
import { useDoSequence } from '../../hooks/useDoSequence';

const mediumRandomPlayer = {
    type: 'shoot',
    materialOptions: {
        material: 'fresnel',
        color: [0, 1, 0]
    },
    patternOptions: {
        pattern: 'single',
        position: [0, 0, 0],
        velocity: [[-1, 1], [-1, 1], -2, 8],
        disablePrecomputation: true,
    },
    meshOptions: {
        mesh: 'sphere',
        radius: 0.2
    },
    behaviourOptions: {
        behaviour: 'linear',
    },
    lifespan: 10,
    wait: 0,
}

export const TumbleweedBehaviour = ({ children, leaveScene }) => {
    const transformNodeRef = useRef();
    const startPosition = useMemo(() => new Vector3(0, 0, 0), []);
    const addBulletGroup = useAddBulletGroup();

    const actionsTimings = useMemo(() => [2, 5], []);

    const actions = useMemo(
        () => [
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    mediumRandomPlayer
                )
            },
            leaveScene,
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [leaveScene]
    );

    useDoSequence(true, transformNodeRef, actionsTimings, actions);

    return (
        <transformNode name position={startPosition} ref={transformNodeRef}>
            {children}
        </transformNode>
    );
};
