import { Animation, BezierCurveEase, Vector3 } from '@babylonjs/core';
import React, { useContext, useMemo, useRef } from 'react';
import { InertOrbitMinionDef } from '../../../stages/common/InertOrbitMinionDef';
import { DIFFICULTY } from '../../../utils/Constants';
import { randVectorToPosition } from '../../BabylonUtils';
import { AnimationContext } from '../../gameLogic/GeneralContainer';
import { useAddBulletGroup } from '../../hooks/useAddBulletGroup';
import { useDoSequence } from '../../hooks/useDoSequence';
import { useName } from '../../hooks/useName';
import { Enemies } from '../Enemies';
import { makeActionListTimeline } from '../EnemyUtils';

export const multiBurst = (difficulty) => ({
    type: 'shoot',
    materialOptions: {
        material: 'fresnel',
        color: [1, 0, 0]
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

export const area = (difficulty) => difficulty >= DIFFICULTY.Hard && {
    type: 'shoot',
    materialOptions: {
        material: 'fresnel',
        color: [1, 0, 0]
    },
    patternOptions: {
        pattern: 'area',
        speed: 4,
        num: 5,
        radialAngle: Math.PI / 4,
        towardsPlayer: true
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
    enemy: InertOrbitMinionDef(new Vector3(0.1, 0, 0)),
    wait: 0
})
enemiesInstructions.push({
    type: "enemies",
    action: 'spawn',
    enemy: InertOrbitMinionDef(new Vector3(-0.1, 0, 0)),
    wait: 0
})

const enemiesActionList = makeActionListTimeline(enemiesInstructions);


export const StrongStage1FairyBehaviour = ({ children, leaveScene, spawn, target }) => {
    const transformNodeRef = useRef();
    const startPosition = useMemo(() => randVectorToPosition(spawn), [spawn]);
    const targetPosition = useMemo(() => randVectorToPosition(target), [target]);
    const { registerAnimation } = useContext(AnimationContext);
    const addBulletGroup = useAddBulletGroup();
    const name = useName("strongStage1Fairy");

    const actionsTimings = useMemo(() => [0, 2, 2, 3, 4, 5, 6, 7], []);

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
                addBulletGroup(
                    transformNodeRef.current,
                    multiBurst
                )
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
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    area
                )
            },
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    area
                )
            },
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    area
                )
            },
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    area
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
