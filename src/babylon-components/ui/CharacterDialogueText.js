import { DynamicTexture, Vector3 } from '@babylonjs/core';
import React, { useEffect, useMemo } from 'react';
import { globals } from '../../components/GlobalsContainer';
import { CHARACTER_CONSTS } from '../../utils/Constants';
import { capFirst } from '../../utils/Utils';
import { textOnCtx } from '../BabylonUtils';

export const CharacterDialogueText = ({ character, text }) => {
    const textTexture = useMemo(() => new DynamicTexture('dialogueTexture', { width: 1024, height: 512 }), []);

    useEffect(() => {
        textTexture.hasAlpha = true;
        const ctx = textTexture.getContext();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        const textColor = CHARACTER_CONSTS[(character === 'player' ? globals.character : character)].color;
        textOnCtx(ctx, `${capFirst((character === 'player' ? globals.character : character))}: `, 0.1, 0.2, 0.6, textColor);
        textOnCtx(ctx, text, 0.06, 0.2, 0.7, textColor);

        textTexture.update();
    }, [text, textTexture, character]);

    return (
        <plane name="dialoguePlane" position={new Vector3(0, 4, -0.5)} width={8} height={4}>
            <standardMaterial
                disableLighting={true}
                useAlphaFromDiffuseTexture
                name="dialogueMaterial"
                diffuseTexture={textTexture}
                emissiveTexture={textTexture}
            />
        </plane>
    );
};
