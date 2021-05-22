import { Animation, DynamicTexture, Vector3 } from '@babylonjs/core';
import { clamp } from 'lodash';
import React, { useEffect, useMemo, useRef } from 'react';
import { useBeforeRender } from 'react-babylonjs';
import { usePrevious } from '../../hooks/usePrevious';
import { CHARACTER_CONSTS } from '../../utils/Constants';
import { capFirst, rerange } from '../../utils/Utils';
import { arcOnCtx, textOnCtx } from '../BabylonUtils';
import { globalActorRefs } from '../gameLogic/StaticRefs';
import { useTexture } from '../hooks/useTexture';

export const BossUI = ({ bossUIProps, spellCardUIProps }) => {
    const { bossName } = bossUIProps;
    const bossUIRef = useRef();
    const characterPortraitRef = useRef();
    const spellCardRef = useRef();

    const previousSpellCardUIProps = usePrevious(spellCardUIProps);
    const textTexture = useMemo(() => new DynamicTexture('bossUITexture', { width: 512, height: 512 }), []);
    const spellCardTexture = useMemo(() => new DynamicTexture('spellCardTexture', { width: 1024, height: 64 }), []);
    const characterTexture = useTexture(spellCardUIProps ? spellCardUIProps.character + 'CharacterNeutral' : 'wriggleCharacterNeutral');
    const characterPortraitPosition = useMemo(() => new Vector3(0, 0, 0), []);
    const spellCardPosition = useMemo(() => new Vector3(4, 2, 0), []);

    useBeforeRender(() => {
        textTexture.hasAlpha = true;
        const ctx = textTexture.getContext();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        const textColor = CHARACTER_CONSTS[bossName].color;
        textOnCtx(ctx, capFirst(bossName), 0.1, 0.5, 0.1, textColor, undefined, undefined, true);

        const bossHealth = globalActorRefs.enemies[0].health;


        const currentLife = bossUIProps.lives.find(life => {
            return bossHealth >= life.healthEnd
        })

        if (!currentLife) return;

        const normalHealthRemaining = bossHealth - (currentLife.spellCards[0]);
        const normalHealthPerc = clamp(normalHealthRemaining / (currentLife.healthStart - (currentLife.spellCards[0])), 0, 1)
        const normalPerc = rerange(normalHealthPerc, 0, 1, currentLife.spellCards.length / 8, 1)

        arcOnCtx(ctx, currentLife.spellCards.length / 8, normalPerc, "#000000")

        currentLife.spellCards.reverse().forEach((spellCardHealthStart, i) => {
            const nextBossHealth = (currentLife.spellCards?.[i - 1] || currentLife.healthEnd);
            const spellCardHealthTotal = spellCardHealthStart - nextBossHealth;
            const spellHealthRemaining = (bossHealth - nextBossHealth);
            const spellCarcPerc = clamp(spellHealthRemaining / spellCardHealthTotal, 0, 1)
            if (spellCarcPerc > 0) {
                arcOnCtx(ctx, 0, (i / 8) + (spellCarcPerc / 8), `rgb(${32 * i + 191}, 0, 0)`)
            }
        })

        textTexture.update();

        bossUIRef.current.position.copyFrom(globalActorRefs.enemies[0].position)
    })

    useEffect(() => {
        if (!spellCardUIProps?.character) return;
        if (spellCardUIProps.spellCard === previousSpellCardUIProps?.spellCard) return;


        Animation.CreateAndStartAnimation(
            'spellCardPortraitAlphaAnim',
            characterPortraitRef.current.material,
            'alpha',
            1,
            2,
            0.8,
            0.0,
            Animation.ANIMATIONLOOPMODE_CONSTANT
        );
        Animation.CreateAndStartAnimation(
            'spellCardPortraitPositionAnim',
            characterPortraitRef.current,
            'position',
            1,
            2,
            new Vector3(4, 10, 0),
            new Vector3(4, 2, 0),
            Animation.ANIMATIONLOOPMODE_CONSTANT
        );

        spellCardTexture.hasAlpha = true;
        const ctx = spellCardTexture.getContext();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        const textColor = CHARACTER_CONSTS[bossName].color;
        textOnCtx(ctx, spellCardUIProps.spellCard, 0.8, 0.5, 0.8, textColor, undefined, undefined, true);
        spellCardTexture.update();

        Animation.CreateAndStartAnimation(
            'spellCardPortraitPositionAnim',
            spellCardRef.current,
            'position',
            1,
            1.5,
            new Vector3(4, 2, 0),
            new Vector3(4, 5, 0),
            Animation.ANIMATIONLOOPMODE_CONSTANT
        );

        window.setTimeout(() => {
            if (!spellCardRef.current) return;
            const relPosition = spellCardRef.current.getAbsolutePosition().subtract(bossUIRef.current.getAbsolutePosition());
            spellCardRef.current.parent = bossUIRef.current;
            Animation.CreateAndStartAnimation(
                'spellCardPortraitPositionAnim',
                spellCardRef.current,
                'position',
                1,
                0.8,
                relPosition,
                new Vector3(0, -1.5, 0),
                Animation.ANIMATIONLOOPMODE_CONSTANT
            );
        }, 1500)
    }, [bossName, previousSpellCardUIProps, spellCardTexture, spellCardUIProps])

    return (
        <>
            <plane ref={bossUIRef} name="bossUIPlane" width={5} height={5} position={new Vector3(-510, -510, -510)} renderingGroupId={1}>
                <standardMaterial
                    disableLighting={true}
                    useAlphaFromDiffuseTexture
                    name="bossUIMaterial"
                    diffuseTexture={textTexture}
                    emissiveTexture={textTexture}
                />
            </plane>
            <plane ref={characterPortraitRef} name={'spellCardCharacterPortrait'} position={characterPortraitPosition} width={8} height={12} renderingGroupId={1}>
                <standardMaterial
                    alpha={0}
                    disableLighting={true}
                    useAlphaFromDiffuseTexture
                    name={'spellCardCharacterPortraitMat'}
                    diffuseTexture={characterTexture}
                    emissiveTexture={characterTexture}
                />
            </plane>
            <plane isVisible={!!spellCardUIProps} ref={spellCardRef} name={'spellCard'} position={spellCardPosition} width={8} height={0.5} renderingGroupId={1}>
                <standardMaterial
                    alpha={1}
                    disableLighting={true}
                    useAlphaFromDiffuseTexture
                    name={'spellCardMat'}
                    diffuseTexture={spellCardTexture}
                    emissiveTexture={spellCardTexture}
                />
            </plane>
        </>
    );
};
