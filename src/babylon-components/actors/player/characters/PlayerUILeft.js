import { DynamicTexture } from '@babylonjs/core';
import React, { useMemo } from 'react';
import { useBeforeRender } from 'react-babylonjs';
import { globals } from '../../../../components/GlobalsContainer';
import { textOnCtx } from '../../../BabylonUtils';

export const PlayerUILeft = ({ ...props }) => {
    const textTexture = useMemo(() => new DynamicTexture('UILeftTexture', { width: 1024, height: 512 }), []);

    useBeforeRender(() => {
        textTexture.hasAlpha = true;
        const ctx = textTexture.getContext();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        const textColor = 'white';
        textOnCtx(ctx, `Power: `, 0.12, 0.05, 0.2, textColor);
        textOnCtx(ctx, `Graze: `, 0.12, 0.05, 0.35, textColor);
        textOnCtx(ctx, `Point: `, 0.12, 0.05, 0.5, textColor);

        textOnCtx(ctx, `${Math.round(globals.POWER)}`, 0.12, 0.4, 0.2, textColor);
        textOnCtx(ctx, `${Math.round(globals.GRAZE)}`, 0.12, 0.4, 0.35, textColor);
        textOnCtx(ctx, `${Math.round(globals.POINT)}`, 0.12, 0.4, 0.5, textColor);

        textTexture.update();
    });

    return (
        <plane name="UILeftPlane" {...props} width={1} height={0.5}>
            <standardMaterial
                disableLighting={true}
                useAlphaFromDiffuseTexture
                name="UILeftMaterial"
                diffuseTexture={textTexture}
                emissiveTexture={textTexture}
            />
        </plane>
    );
};
