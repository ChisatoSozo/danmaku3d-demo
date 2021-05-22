import { Vector3 } from '@babylonjs/core';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { DEV_OVERPOWERED, PLAYER_BULLETS_WHEEL_LENGTH } from '../../../../../utils/Constants';
import { BulletsContext } from '../../../../gameLogic/GeneralContainer';
import { allBullets } from '../../../../gameLogic/StaticRefs';
import { useName } from '../../../../hooks/useName';
import { useShoot } from '../../useShoot';

const makeShotInstruction = (powerClass) => {
    let shotSources;

    switch (powerClass) {
        case 0:
        case 1:
            shotSources = [new Vector3(0, 0, 0.15)];
            break;
        case 2:
        case 3:
            shotSources = [
                new Vector3(0.3 * Math.cos(2.09 * 0), 0.3 * Math.sin(2.09 * 0), 0.15),
                new Vector3(0.3 * Math.cos(2.09 * 1), 0.3 * Math.sin(2.09 * 1), 0.15),
                new Vector3(0.3 * Math.cos(2.09 * 2), 0.3 * Math.sin(2.09 * 2), 0.15),
            ];
            break;
        default:
            throw new Error('Unknown power class ' + powerClass);
    }

    const instruction = {
        type: 'shoot',
        materialOptions: {
            material: 'texture',
            texture: 'reimu_ofuda',
            hasAlpha: true,
            doubleSided: true,
        },
        patternOptions: {
            pattern: 'empty',
            num: PLAYER_BULLETS_WHEEL_LENGTH * shotSources.length,
        },
        meshOptions: {
            mesh: 'card',
        },
        behaviourOptions: {
            behaviour: 'playerShot',
            bulletValue: DEV_OVERPOWERED ? 50 : 1,
            shotSources: shotSources,
            shotSpeed: 20,
        },
        soundOptions: false,
        lifespan: Infinity,
        wait: 0,
    };

    return instruction;
};

export const ReimuLinearBulletEmitter = ({ powerClass, ...props }) => {
    const transformNodeRef = useRef();
    const { addBulletGroup, disposeSingle } = useContext(BulletsContext);
    const [shotId, setShotId] = useState();
    const name = useName('LinearBulletEmitter');

    useEffect(() => {
        if (!transformNodeRef.current) return;

        const id = addBulletGroup(transformNodeRef.current, makeShotInstruction(powerClass), false, true);
        setShotId(id);

        return () => {
            allBullets[id].behaviour.disabled = true;
            window.setTimeout(() => {
                disposeSingle(id);
            }, 5000);
        };
    }, [addBulletGroup, disposeSingle, powerClass]);

    useShoot(transformNodeRef, shotId, false, 15)

    return <transformNode name={name} ref={transformNodeRef} {...props} />;
};
