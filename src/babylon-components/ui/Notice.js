import { Animation, DynamicTexture, Vector3 } from '@babylonjs/core';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useBeforeRender } from 'react-babylonjs';
import { globals } from '../../components/GlobalsContainer';
import { usePrevious } from '../../hooks/usePrevious';
import { playerPowerUp } from '../../sounds/SFX';
import { calcPowerClass } from '../actors/player/PlayerUtils';
import { textOnCtx } from '../BabylonUtils';

export const Notice = () => {
    const textTexture = useMemo(
        () =>
            new DynamicTexture('NoticeTexture', {
                width: 1024,
                height: 512,
            }),
        []
    );

    const [powerClass, setPowerClass] = useState(0);
    const lastPowerClass = usePrevious(powerClass);
    const matRef = useRef();

    const [notice, setNotice] = useState('');
    const [redrawTrigger, setRedrawTrigger] = useState(0);

    useEffect(() => {
        textTexture.hasAlpha = true;
        const ctx = textTexture.getContext();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        textOnCtx(ctx, notice, 0.3, 0.05, 0.5, 'white', 'black');

        textTexture.update();

        window.setTimeout(() => {
            Animation.CreateAndStartAnimation(
                'noticeAnim',
                matRef.current,
                'alpha',
                60,
                120,
                matRef.current.alpha,
                0,
                Animation.ANIMATIONLOOPMODE_CONSTANT
            );
        }, 5000);
    }, [notice, redrawTrigger, textTexture]);

    useEffect(() => {
        if (powerClass > lastPowerClass) {
            playerPowerUp.play();
            matRef.current.alpha = 1;
            setNotice('Power Up!');
        }
    }, [powerClass, lastPowerClass]);

    useBeforeRender(() => {
        const newPowerClass = calcPowerClass(globals.POWER);
        if (powerClass !== newPowerClass) {
            setPowerClass(newPowerClass);
            setRedrawTrigger((redrawTrigger) => redrawTrigger + 1);
        }
    });

    return (
        <plane name="NoticePlane" position={new Vector3(0, 10, 3)} width={4} height={2}>
            <standardMaterial
                ref={matRef}
                alpha={0}
                disableLighting={true}
                useAlphaFromDiffuseTexture
                name="NoticeMaterial"
                diffuseTexture={textTexture}
                emissiveTexture={textTexture}
            />
        </plane>
    );
};
