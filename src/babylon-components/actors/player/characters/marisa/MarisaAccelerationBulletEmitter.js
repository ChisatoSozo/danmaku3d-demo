import { Vector3 } from '@babylonjs/core';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { PLAYER_BULLETS_WHEEL_LENGTH } from '../../../../../utils/Constants';
import { BulletsContext } from '../../../../gameLogic/GeneralContainer';
import { allBullets } from '../../../../gameLogic/StaticRefs';
import { useName } from '../../../../hooks/useName';
import { useShoot } from '../../useShoot';

const makeShotInstruction = (powerClass, initialVelocity) => {
    let shotSources;

    switch (powerClass) {
        case 0:
            throw new Error('Acceleration bullets should not be enabled for a power class of 0');
        case 1:
            shotSources = [new Vector3(0, -1, 0.15)];
            break;
        case 2:
            shotSources = [new Vector3(0, -1, 0.15)];
            break;
        case 3:
            shotSources = [new Vector3(0, -1, 0.15)];
            break;
        default:
            throw new Error('Unknown power class ' + powerClass);
    }

    const instruction = {
        type: 'shoot',
        materialOptions: {
            material: 'fresnel',
            color: [0.2, 0.6, 1],
            alpha: 0.05,
            hasAlpha: true,
            doubleSided: true,
        },
        patternOptions: {
            pattern: 'empty',
            num: PLAYER_BULLETS_WHEEL_LENGTH * shotSources.length,
        },
        meshOptions: {
            mesh: 'marisaBullet',
            radius: 2
        },
        behaviourOptions: {
            behaviour: 'playerShotAcceleration',
            initialShotVector: initialVelocity,
            shotSources: shotSources,
            shotSpeed: 20,
            bulletValue: 10
        },
        soundOptions: false,
        lifespan: Infinity,
        wait: 0,
    };

    return instruction;
};

export const MarisaAccelerationBulletEmitter = ({ powerClass, initialVelocity, ...props }) => {
    const transformNodeRef = useRef();
    const { addBulletGroup, disposeSingle } = useContext(BulletsContext);
    const [shotId, setShotId] = useState();
    const name = useName('AccelerationBulletEmitter');

    useEffect(() => {
        if (!transformNodeRef.current) return;

        const id = addBulletGroup(transformNodeRef.current, makeShotInstruction(powerClass, initialVelocity));
        setShotId(id);

        return () => {
            allBullets[id].behaviour.disabled = true;
            window.setTimeout(() => {
                disposeSingle(id);
            }, 5000);
        };
    }, [addBulletGroup, disposeSingle, powerClass, initialVelocity]);

    useShoot(transformNodeRef, shotId, false, 5)

    return <transformNode name={name} ref={transformNodeRef} {...props} />;
};
