import { Animation, Vector3 } from '@babylonjs/core';
import React, { useEffect, useMemo, useRef } from 'react';
import { globals } from '../../components/GlobalsContainer';
import { capFirst } from '../../utils/Utils';
import { useTexture } from '../hooks/useTexture';

export const CharacterPortrait = ({ name, side, active, emotion, index }) => {
    const camelEmotion = capFirst(emotion);
    const characterTexture = useTexture((name === 'player' ? globals.character : name) + 'Character' + camelEmotion);
    const position = useMemo(
        () => new Vector3(side === 'left' ? -6 : 5, 5, active ? 0 : index + 1),
        //eslint-disable-next-line react-hooks/exhaustive-deps
        [side]
    );

    const matRef = useRef();
    const planeRef = useRef();



    useEffect(() => {
        matRef.current.alpha = active ? 1 : 0.5;
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!planeRef.current) return;

        if (active) {
            const posTarget = planeRef.current.position.clone();
            posTarget.z = 0;
            posTarget.x = side === 'left' ? -5 : 4
            Animation.CreateAndStartAnimation(
                name + 'alphaAnim',
                matRef.current,
                'alpha',
                60,
                10,
                matRef.current.alpha,
                1,
                Animation.ANIMATIONLOOPMODE_CONSTANT
            );
            Animation.CreateAndStartAnimation(
                name + 'positionAnim',
                planeRef.current,
                'position',
                60,
                10,
                planeRef.current.position,
                posTarget,
                Animation.ANIMATIONLOOPMODE_CONSTANT
            );
        } else {
            const posTarget = planeRef.current.position.clone();
            posTarget.z = index + 1;
            posTarget.x = side === 'left' ? -6 : 5
            Animation.CreateAndStartAnimation(
                name + 'alphaAnim',
                matRef.current,
                'alpha',
                60,
                10,
                matRef.current.alpha,
                0.5,
                Animation.ANIMATIONLOOPMODE_CONSTANT
            );
            Animation.CreateAndStartAnimation(
                name + 'positionAnim',
                planeRef.current,
                'position',
                60,
                10,
                planeRef.current.position,
                posTarget,
                Animation.ANIMATIONLOOPMODE_CONSTANT
            );
        }
    }, [active, index, name]);

    return (
        <plane ref={planeRef} name={name} position={position} width={4} height={6}>
            <standardMaterial
                ref={matRef}
                disableLighting={true}
                useAlphaFromDiffuseTexture
                name={name + 'mat'}
                diffuseTexture={characterTexture}
                emissiveTexture={characterTexture}
            />
        </plane>
    );
};
