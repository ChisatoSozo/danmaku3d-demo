import { Animation, Color3, EasingFunction, SineEase, Space, Vector3 } from '@babylonjs/core';
import { times } from 'lodash';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useBeforeRender, useScene } from 'react-babylonjs';
import { useKeydown, useKeyup } from '../../../../../hooks/useKeydown';
import { PLAYER_INVULNERABLE_COOLDOWN } from '../../../../../utils/Constants';
import { useGlowLayer } from '../../../../gameLogic/useGlowLayer';
import { useDoSequence } from '../../../../hooks/useDoSequence';
import { useName } from '../../../../hooks/useName';
import { useTarget } from '../../../../hooks/useTarget';
import { useTexture } from '../../../../hooks/useTexture';
import { PlayerUILeft } from '../PlayerUILeft';
import { PlayerUIRight } from '../PlayerUIRight';
import { MarisaAccelerationBulletEmitter } from './MarisaAccelerationBulletEmitter';
import { MarisaLinearBulletEmitter } from './MarisaLinearBulletEmitter';

const UIPosition = new Vector3(0, -0.6, 0);
const lightBlue = new Color3(0.2, 0.6, 1);

export const MarisaMagicCircle = ({ isBombing, powerClass, side, isInvulnerable }) => {
    const name = useName("MarisaMagicCircle")
    const sphereTransformRef = useRef();
    const planeRef = useRef();
    const smallPlaneRef = useRef();
    const sideCoefficient = useMemo(() => side === 'right' ? 1 : -1, [side])
    const UIClass = useMemo(() => side === 'right' ? PlayerUIRight : PlayerUILeft, [side])
    const linearBulletEmitterPosition = useMemo(() => new Vector3(sideCoefficient * 0.15, 0, 0), [sideCoefficient])
    const spherePosition = useMemo(() => new Vector3(sideCoefficient, 0, 0), [sideCoefficient])
    const focusPosition = useMemo(() => new Vector3(sideCoefficient * 0.5, 0, 0), [sideCoefficient])
    const unfocusPosition = useMemo(() => new Vector3(sideCoefficient, 0, 0), [sideCoefficient])
    const [focused, setFocused] = useState(false);
    const accelerationInitialVelocity = useMemo(() => [0, 0, 0.01], []);
    const glowLayer = useGlowLayer()
    const scene = useScene();
    const rune1 = useTexture("rune1");
    const target = useTarget();

    useEffect(() => {
        if (focused) {
            Animation.CreateAndStartAnimation(
                'anim',
                sphereTransformRef.current,
                'position',
                60,
                15,
                sphereTransformRef.current.position,
                focusPosition,
                Animation.ANIMATIONLOOPMODE_CONSTANT
            );
        }
        else {
            Animation.CreateAndStartAnimation(
                'anim',
                sphereTransformRef.current,
                'position',
                60,
                15,
                sphereTransformRef.current.position,
                unfocusPosition,
                Animation.ANIMATIONLOOPMODE_CONSTANT
            );
        }
    }, [focusPosition, focused, unfocusPosition])

    useKeydown('SLOW', () => {
        setFocused(true)

    });

    useKeyup('SLOW', () => {
        setFocused(false)
    });

    //sphere blinking
    const invulnerableTimings = useMemo(() =>
        times(40, (num) => {
            return PLAYER_INVULNERABLE_COOLDOWN * num / 40
        }),
        []);

    const invulnerableActions = useMemo(() => [
        ...times(39, (num) => {
            return () => {
                planeRef.current.isVisible = num % 2 === 0
            }
        }),
        () => {
            planeRef.current.isVisible = true
        }
    ], []);

    useDoSequence(isInvulnerable, planeRef, invulnerableTimings, invulnerableActions);

    useEffect(() => {
        glowLayer.addIncludedOnlyMesh(planeRef.current)
        const sineAnimation = new Animation(name + "sineAnimation", "position", 30, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CYCLE);
        const keysSineAnimation = [];
        keysSineAnimation.push({ frame: 0, value: new Vector3(0, 0, 0.5) });
        keysSineAnimation.push({ frame: 30, value: new Vector3(0, 0, 0.4) });
        keysSineAnimation.push({ frame: 60, value: new Vector3(0, 0, 0.5) });
        sineAnimation.setKeys(keysSineAnimation);

        const cubicEasing = new SineEase();
        cubicEasing.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT)
        sineAnimation.setEasingFunction(cubicEasing);

        smallPlaneRef.current.animations.push(sineAnimation);
        scene.beginAnimation(smallPlaneRef.current, 0, 60, true);
    }, [glowLayer, name, scene])

    useBeforeRender(() => {
        if (!target || !planeRef.current) return;

        planeRef.current.lookAt(target, 0, 0, 0, Space.WORLD);
    })

    return (
        <transformNode name={name + 'sphereTransform'} ref={sphereTransformRef} position={spherePosition}>
            {!isBombing && <UIClass position={UIPosition} />}
            <MarisaLinearBulletEmitter focused={focused} side={side} position={linearBulletEmitterPosition} powerClass={powerClass} />
            {powerClass > 0 && (
                <MarisaAccelerationBulletEmitter initialVelocity={accelerationInitialVelocity} powerClass={powerClass} />
            )}
            <plane
                name={name + 'plane'}
                scaling={new Vector3(0.5, 0.5, 0.5)}
                ref={planeRef}
            >
                <standardMaterial alpha={0.5} useAlphaFromDiffuseTexture disableLighting={true} diffuseTexture={rune1} emissiveColor={lightBlue} name={name + 'planeMat'} />
                <plane
                    name={name + 'smallPlane'}
                    scaling={new Vector3(0.5, 0.5, 0.5)}
                    position={new Vector3(0, 0, 0.5)}
                    ref={smallPlaneRef}
                >
                    <standardMaterial alpha={0.5} useAlphaFromDiffuseTexture disableLighting={true} diffuseTexture={rune1} emissiveColor={lightBlue} name={name + 'planeMat'} />
                </plane>
            </plane>
        </transformNode>
    )
}
