import { Vector3 } from '@babylonjs/core';
import React, { useMemo, useRef } from 'react';
import { RotateAndShootMinionDef } from "../../../stages/common/RotateAndShootMinionDef";
import { randVectorToPosition } from '../../BabylonUtils';
import { useAddBulletGroup } from '../../hooks/useAddBulletGroup';
import { useDoSequence } from '../../hooks/useDoSequence';
import { useName } from '../../hooks/useName';
import { Enemies } from '../Enemies';
import { makeActionListTimeline } from '../EnemyUtils';

export const strongerMultiBurst = (difficulty) => ({
    type: 'shoot',
    materialOptions: {
        material: 'fresnel',
        color: [0, 0, 1]
    },
    patternOptions: {
        pattern: 'multiBurst',
        speeds: [4, 8],
        num: 300 * difficulty
    },
    meshOptions: {
        mesh: 'egg',
        radius: 0.2
    },
    behaviourOptions: {
        behaviour: 'linear',
    },
    lifespan: 10,
    wait: 0,
})

export const cone = {
    type: 'shoot',
    materialOptions: {
        material: 'fresnel',
        color: [0, 0, 1]
    },
    patternOptions: {
        pattern: 'randomCone',
        speed: 8,
        num: 100,
        radialAngle: Math.PI,
        forwardVectors: [
            [0, 0, -1],
            [0.866, -0.25, 0.25],
            [-0.866, -0.25, 0.25],
            [0, 0.866, 0.25],
        ]
    },
    meshOptions: {
        mesh: 'sphere',
        radius: 0.2
    },
    behaviourOptions: {
        behaviour: 'linear',
    },
    soundOptions: {
        mute: true
    },
    lifespan: 10,
    wait: 0,
}

const enemiesInstructions = []

enemiesInstructions.push({
    type: "enemies",
    action: 'empty',
    wait: 2.5
})


enemiesInstructions.push({
    type: "enemies",
    action: 'spawn',
    enemy: RotateAndShootMinionDef({ color: [0, 0, 1], spawn: new Vector3(0.1, 0, 0) }),
    wait: 0
})
enemiesInstructions.push({
    type: "enemies",
    action: 'spawn',
    enemy: RotateAndShootMinionDef({ color: [0, 0, 1], spawn: new Vector3(-0.1, 0, 0) }),
    wait: 0
})
enemiesInstructions.push({
    type: "enemies",
    action: 'spawn',
    enemy: RotateAndShootMinionDef({ color: [0, 0, 1], spawn: new Vector3(0, 0.1, 0) }),
    wait: 0
})
enemiesInstructions.push({
    type: "enemies",
    action: 'spawn',
    enemy: RotateAndShootMinionDef({ color: [0, 0, 1], spawn: new Vector3(0, -0.1, 0) }),
    wait: 0
})

const enemiesActionList = makeActionListTimeline(enemiesInstructions);

export const StrongerStage1FairyBehaviour = ({ children, leaveScene, spawn, target }) => {
    const transformNodeRef = useRef();
    const startPosition = useMemo(() => spawn ? randVectorToPosition(spawn) : new Vector3(0, 0, 0), [spawn]);
    const addBulletGroup = useAddBulletGroup();
    const name = useName("strongStage1Fairy");
    const actionsTimings = useMemo(() => [2, 4, 7], []);

    const actions = useMemo(
        () => [
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    strongerMultiBurst
                )
            },
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    cone
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
            <Enemies currentActionList={enemiesActionList} />
            {children}
        </transformNode>
    );
};
