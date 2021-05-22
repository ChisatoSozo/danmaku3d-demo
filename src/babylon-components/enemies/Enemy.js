import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useBeforeRender } from 'react-babylonjs';
import { addEnemy, globalActorRefs, removeEnemy } from '../gameLogic/StaticRefs';
import { useAddBulletGroup } from '../hooks/useAddBulletGroup';
import { makeEnemyMesh } from './enemyActors';
import { Targeting } from './enemyActors/Targeting';
import { makeEnemyBehaviour } from './enemyBehaviours';
import { makeEnemyMovement } from './enemyMovements';


export const Enemy = ({ name, radius, health, deathInstruction, removeEnemyFromScene, meshProps, behaviourProps, movementProps, isBoss }) => {
    const enemyRef = useRef();
    const [enemy, setEnemy] = useState();
    const [positionID, setPositionID] = useState();
    const addBulletGroup = useAddBulletGroup();

    const leaveScene = useCallback(() => {
        if (positionID === undefined || positionID === null || globalActorRefs.enemies[positionID].dead) return;
        removeEnemy(positionID);
        removeEnemyFromScene(name);
    }, [removeEnemyFromScene, name, positionID]);

    useEffect(() => {
        if (!enemy) return; //on death
        const id = addEnemy(
            enemy.getAbsolutePosition(),
            radius,
            () => {
                const deathPosition = enemy.getAbsolutePosition()
                if (deathInstruction) addBulletGroup({
                    getAbsolutePosition: () => {
                        return deathPosition;
                    }
                }, deathInstruction);
                removeEnemyFromScene(name, deathPosition);
            },
            health,
            isBoss
        );
        setPositionID(id);
    }, [enemy, radius, name, removeEnemyFromScene, health, deathInstruction, addBulletGroup, isBoss]);

    useEffect(() => {
        return () => {
            leaveScene();
        }
    }, [leaveScene])

    useBeforeRender(() => {

        if (enemyRef.current && !enemy) {
            setEnemy(enemyRef.current);
        }
        if (!enemy || !positionID || globalActorRefs.enemies[positionID].dead) return;

        const enemyWorldPosition = enemy.getAbsolutePosition();

        globalActorRefs.enemies[positionID].position = enemyWorldPosition;
    });

    const BehaviourClass = useMemo(() => makeEnemyBehaviour(behaviourProps.type), [behaviourProps.type]);
    const EnemyMeshClass = useMemo(() => makeEnemyMesh(meshProps.type), [meshProps.type]);
    const MovementClass = useMemo(() => makeEnemyMovement(movementProps.type), [movementProps.type])

    return <MovementClass name={name} {...movementProps}>
        <BehaviourClass leaveScene={leaveScene} {...behaviourProps}>
            <Targeting radius={radius} />
            <EnemyMeshClass radius={radius} {...meshProps} ref={enemyRef} />
        </BehaviourClass>
    </MovementClass>;
};
