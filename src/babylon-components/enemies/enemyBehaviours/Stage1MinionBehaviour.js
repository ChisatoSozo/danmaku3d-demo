import { Vector3 } from '@babylonjs/core';
import React, { useEffect, useMemo, useRef } from 'react';
import { randVectorToPosition } from '../../BabylonUtils';
import { useAddBulletGroup } from '../../hooks/useAddBulletGroup';
import { useDoSequence } from '../../hooks/useDoSequence';

const smallInstruction = (color) => ({
    type: 'shoot',
    materialOptions: {
        material: 'fresnel',
        color
    },
    patternOptions: {
        pattern: 'single',
        speed: 8,
        position: [0, 0, 0],
        velocity: [0, 0, -8],
        repeat: {
            times: 32,
            delay: 0.1
        }
    },
    meshOptions: {
        mesh: 'sphere',
        radius: 0.1
    },
    behaviourOptions: {
        behaviour: 'linear',
    },
    soundOptions: {
        mute: true
    },
    lifespan: 10,
    wait: 0,
})

export const yellowSmall = smallInstruction([1, 1, 0]);
export const whiteSmall = smallInstruction([1, 1, 1]);
export const blueSmall = smallInstruction([0, 0, 1]);

const small = (color) => {
    switch (JSON.stringify(color)) {
        case JSON.stringify([1, 1, 0]):
            return yellowSmall;
        case JSON.stringify([1, 1, 1]):
            return whiteSmall;
        case JSON.stringify([0, 0, 1]):
            return blueSmall;
        default:
            throw new Error('no precomputed pattern for color ' + JSON.stringify(color));
    }
}

export const Stage1MinionBehaviour = ({ children, leaveScene, spawn, color }) => {
    const transformNodeRef = useRef();
    const startPosition = useMemo(() => spawn ? randVectorToPosition(spawn) : new Vector3(0, 0, 0), [spawn]);
    const actionsTimings = useMemo(() => [2, 15], []);
    const addBulletGroup = useAddBulletGroup();

    const actions = useMemo(
        () => [
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    small(color)
                )
            },
            leaveScene
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    useDoSequence(true, transformNodeRef, actionsTimings, actions);

    useEffect(() => {
        return () => {
            leaveScene();
        }
    }, [leaveScene])

    return (
        <transformNode name position={startPosition} ref={transformNodeRef}>
            {children}
        </transformNode>
    );
};
