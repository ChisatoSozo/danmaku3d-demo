import { Vector3 } from '@babylonjs/core';
import React, { useMemo, useRef } from 'react';
import { DIFFICULTY } from '../../../utils/Constants';
import { useAddBulletGroup } from '../../hooks/useAddBulletGroup';
import { useDoSequence } from '../../hooks/useDoSequence';
import { useName } from '../../hooks/useName';

export const smallTowardsPlayer = (difficulty) => difficulty >= DIFFICULTY.Normal && {
    type: 'shoot',
    materialOptions: {
        material: 'fresnel',
        color: [0, 0, 1]
    },
    patternOptions: {
        pattern: 'single',
        towardsPlayer: true,
        speed: 8,
        position: [0, 0, 0]
    },
    meshOptions: {
        mesh: 'sphere',
        radius: 0.1
    },
    behaviourOptions: {
        behaviour: 'linear',
    },
    lifespan: 10,
    wait: 0,
}

export const mediumTowardsPlayer = (difficulty) => difficulty >= DIFFICULTY.Hard && {
    type: 'shoot',
    materialOptions: {
        material: 'fresnel',
        color: [1, 0, 0]
    },
    patternOptions: {
        pattern: 'single',
        towardsPlayer: true,
        speed: 8,
        position: [0, 0, 0]
    },
    meshOptions: {
        mesh: 'sphereWithHalo',
        radius: 0.2
    },
    behaviourOptions: {
        behaviour: 'linear',
    },
    lifespan: 10,
    wait: 0,
}

export const DefaultFairyBehaviour = ({ children, leaveScene, spawn }) => {
    const transformNodeRef = useRef();
    const startPosition = useMemo(() => new Vector3(0, 0, 0), []);
    const addBulletGroup = useAddBulletGroup();
    const name = useName("DefaultFairyBehaviour")

    const actionsTimings = useMemo(() => [2, 3.2, 4.1, 5.5, 6.3, 7], []);

    const actions = useMemo(
        () => [
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    smallTowardsPlayer,
                )
            },
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    mediumTowardsPlayer,
                )
            },
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    mediumTowardsPlayer,
                )
            },
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    mediumTowardsPlayer,
                )
            },
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    mediumTowardsPlayer,
                )
            },
            leaveScene,
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [leaveScene]
    );

    useDoSequence(true, transformNodeRef, actionsTimings, actions);

    return (
        <transformNode name={name} position={startPosition} ref={transformNodeRef}>
            {children}
        </transformNode>
    );
};
