import { useCallback, useMemo, useRef, useState } from 'react';
import { useBeforeRender } from 'react-babylonjs';
import { filterInPlace } from '../../utils/Utils';
import { useAddEffect } from '../hooks/useAddEffect';
import { makeName } from '../hooks/useName';
import { Enemy } from './Enemy';

export const Enemies = ({ currentActionList, setEpochIndex }) => {
    //eslint-disable-next-line react-hooks/exhaustive-deps
    const timeSinceStart = useMemo(() => ({ current: 0 }), [currentActionList]);
    const metaEnemies = useRef({});
    const listeningForEnemiesDead = useRef(false);
    const [enemies, setEnemies] = useState({});
    const addEffect = useAddEffect();

    const removeEnemyFromScene = useCallback((enemyName, deathLocation = false) => {
        metaEnemies.current = { ...metaEnemies.current };

        if (deathLocation) {
            const deathStartLocation = deathLocation.clone();
            addEffect(deathStartLocation, {
                type: 'particles',
                name: 'death'
            });
        }

        delete metaEnemies.current[enemyName];
    }, [addEffect]);

    const doSpawnAction = useCallback((enemy) => {
        const enemyName = makeName(enemy.asset);
        metaEnemies.current = {
            ...metaEnemies.current,
            [enemyName]: enemy,
        };
    }, []);

    const executeAction = useCallback((action) => {
        switch (action.action) {
            case 'spawn':
                doSpawnAction(action.enemy);
                break;
            case 'nextEpoch':
                listeningForEnemiesDead.current = true;
                break;
            case 'empty':
                break;
            default:
                console.warn('Unsupported enemy-action action: ' + action.action);
        }
    }, [doSpawnAction]);

    useBeforeRender((scene) => {
        const deltaS = scene.paused ? 0 : scene.getEngine().getDeltaTime() / 1000;
        timeSinceStart.current += deltaS;

        currentActionList.some((action) => {
            if (action.timeline < timeSinceStart.current) {
                executeAction(action);
                return false;
            }
            return true;
        });

        filterInPlace(currentActionList, (action) => action.timeline >= timeSinceStart.current);

        if (metaEnemies.current !== enemies) {
            setEnemies(metaEnemies.current);
        }

        if (listeningForEnemiesDead.current) {
            if (Object.keys(enemies).length === 0) {
                setEpochIndex(epochIndex => epochIndex + 1);
                listeningForEnemiesDead.current = false;
            }
        }
    });

    return Object.keys(enemies).map((enemyName) => {
        const enemyObj = enemies[enemyName];
        return <Enemy
            removeEnemyFromScene={removeEnemyFromScene}
            key={enemyName}
            name={enemyName}
            {...enemyObj}
        />
    });
};
