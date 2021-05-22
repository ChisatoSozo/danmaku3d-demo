import { Animation, DynamicTexture, Vector3 } from '@babylonjs/core';
import React, { useEffect, useMemo, useRef } from 'react';
import { textOnCtx } from '../BabylonUtils';
export const StageStartQuote = ({ text }) => {
    const textTexture = useMemo(
        () =>
            new DynamicTexture('dialogueTexture', {
                width: 1024,
                height: 1024,
            }),
        []
    );
    const matRef = useRef();

    const planeRef = useRef()


    useEffect(() => {
        textTexture.hasAlpha = true;
        const ctx = textTexture.getContext();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        const textColor = 'white';
        textOnCtx(ctx, text[0], 0.05, 0, 0.2, textColor);
        textOnCtx(ctx, text[1], 0.06, 0.1, 0.3, textColor);
        textOnCtx(ctx, text[2], 0.03, 0.1, 0.4, textColor);

        textTexture.update();

        window.setTimeout(() => {
            Animation.CreateAndStartAnimation(
                'quoteAlphaAnim',
                matRef.current,
                'alpha',
                60,
                120,
                matRef.current.alpha,
                0,
                Animation.ANIMATIONLOOPMODE_CONSTANT
            );
        }, 5000);
    }, [text, textTexture]);

    return (
        <plane ref={planeRef} name="dialoguePlane" position={new Vector3(0, 4, -0.5)} width={8} height={8}>
            <standardMaterial
                ref={matRef}
                disableLighting={true}
                useAlphaFromDiffuseTexture
                name="dialogueMaterial"
                diffuseTexture={textTexture}
                emissiveTexture={textTexture}
            />
        </plane>
    );
};
