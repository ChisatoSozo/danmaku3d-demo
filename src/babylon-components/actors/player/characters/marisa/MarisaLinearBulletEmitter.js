import { Vector3 } from '@babylonjs/core';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { DEV_OVERPOWERED, PLAYER_BULLETS_WHEEL_LENGTH } from '../../../../../utils/Constants';
import { BulletsContext } from '../../../../gameLogic/GeneralContainer';
import { allBullets } from '../../../../gameLogic/StaticRefs';
import { useName } from '../../../../hooks/useName';
import { useShoot } from '../../useShoot';

const makeShotInstruction = (powerClass, side) => {
    let shotSources;
    let initialVelocities;
    const sideCoefficient = side === 'right' ? 1 : -1;

    switch (powerClass) {
        case 0:
            shotSources = [new Vector3(0, 0, 0.15)];
            initialVelocities = [new Vector3(0, 0, 0)]
            break;
        case 1:
            shotSources = [
                new Vector3(sideCoefficient * 0.15, 0.15, 0.15),
                new Vector3(sideCoefficient * 0.15, -0.15, 0.15)
            ];
            initialVelocities = [
                new Vector3(0, 0, 0),
                new Vector3(0, 0, 0)
            ]
            break;
        case 2:
            shotSources = [
                new Vector3(0, 0, 0.15),
                new Vector3(0, 0, 0.15),
                new Vector3(sideCoefficient * 0.15, 0.15, 0.15),
                new Vector3(sideCoefficient * 0.15, -0.15, 0.15)
            ];
            initialVelocities = [
                new Vector3(0, 0, 0),
                new Vector3(0, 0, 0),
                new Vector3(sideCoefficient * 2, 0, 0),
                new Vector3(sideCoefficient * 2, 0, 0)
            ]
            break;
        case 3:
            shotSources = [
                new Vector3(0, 0, 0.15),
                new Vector3(sideCoefficient * 0.15, 0.15, 0.15),
                new Vector3(sideCoefficient * 0.15, -0.15, 0.15),
                new Vector3(sideCoefficient * 0.3, 0.3, 0.15),
                new Vector3(sideCoefficient * 0.3, 0, 0.15),
                new Vector3(sideCoefficient * 0.3, -0.3, 0.15)
            ];
            initialVelocities = [
                new Vector3(0, 0, 0),
                new Vector3(sideCoefficient * 2, 0, 0),
                new Vector3(sideCoefficient * 2, 0, 0),
                new Vector3(sideCoefficient * 4, 0, 0),
                new Vector3(sideCoefficient * 4, 0, 0),
                new Vector3(sideCoefficient * 4, 0, 0)
            ]
            break;
        default:
            throw new Error('Unknown power class ' + powerClass);
    }

    const instruction = {
        type: 'shoot',
        materialOptions: {
            material: 'fresnel',
            color: [0.2, 0.6, 1],
            hasAlpha: true,
            doubleSided: true,
        },
        patternOptions: {
            pattern: 'empty',
            num: PLAYER_BULLETS_WHEEL_LENGTH * shotSources.length,
        },
        meshOptions: {
            mesh: 'marisaBullet',
            radius: 0.5
        },
        behaviourOptions: {
            behaviour: 'playerShot',
            bulletValue: DEV_OVERPOWERED ? 50 : 0.7,
            initialVelocities,
            shotSources,
            shotSpeed: 20,
        },
        soundOptions: false,
        lifespan: Infinity,
        wait: 0,
    };

    return instruction;
};

export const MarisaLinearBulletEmitter = ({ powerClass, side, focused, ...props }) => {
    const transformNodeRef = useRef();
    const { addBulletGroup, disposeSingle } = useContext(BulletsContext);
    const [shotId, setShotId] = useState();
    const name = useName('LinearBulletEmitter');

    useEffect(() => {
        if (!transformNodeRef.current) return;

        const id = addBulletGroup(transformNodeRef.current, makeShotInstruction(powerClass, side), false, true);
        setShotId(id);

        return () => {
            allBullets[id].behaviour.disabled = true;
            window.setTimeout(() => {
                disposeSingle(id);
            }, 5000);
        };
    }, [addBulletGroup, disposeSingle, powerClass, side]);

    useShoot(transformNodeRef, shotId, focused, 15)

    return <transformNode name={name} ref={transformNodeRef} {...props} />;
};
