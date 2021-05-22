import { Animation, Color3, Space, StandardMaterial, Vector3 } from '@babylonjs/core';
import { times } from 'lodash';
import React, { useMemo, useRef } from 'react';
import { useBeforeRender, useScene } from 'react-babylonjs';
import { useKeydown, useKeyup } from '../../../../../hooks/useKeydown';
import { PLAYER_INVULNERABLE_COOLDOWN } from '../../../../../utils/Constants';
import { useGlowLayer } from '../../../../gameLogic/useGlowLayer';
import { useDoSequence } from '../../../../hooks/useDoSequence';
import { useName } from '../../../../hooks/useName';
import { TrailMesh } from '../../../../TrailMesh';
import { PlayerUILeft } from '../PlayerUILeft';
import { PlayerUIRight } from '../PlayerUIRight';
import { ReimuLinearBulletEmitter } from './ReimuLinearBulletEmitter';
import { ReimuTrackingBulletEmitter } from './ReimuTrackingBulletEmitter';

const UIPosition = new Vector3(0, -0.6, 0);
const z = new Vector3(0, 0, 1);

export const ReimuOrb = ({ isBombing, powerClass, side, isInvulnerable }) => {
    const name = useName("ReimuOrb")
    const sphereTransformRef = useRef();
    const sphereRef = useRef();
    const trailRef = useRef();
    const sideCoefficient = useMemo(() => side === 'right' ? 1 : -1, [side])
    const UIClass = useMemo(() => side === 'right' ? PlayerUIRight : PlayerUILeft, [side])
    const linearBulletEmitterPosition = useMemo(() => new Vector3(sideCoefficient * 0.15, 0, 0), [sideCoefficient])
    const spherePosition = useMemo(() => new Vector3(sideCoefficient, 0, 0), [sideCoefficient])
    const focusPosition = useMemo(() => new Vector3(sideCoefficient * 0.5, 0, 0), [sideCoefficient])
    const unfocusPosition = useMemo(() => new Vector3(sideCoefficient, 0, 0), [sideCoefficient])
    const trackingInitialVelocity = useMemo(() => [sideCoefficient * 6, 0, 4], [sideCoefficient]);
    const glowLayer = useGlowLayer();
    const scene = useScene();

    useKeydown('SLOW', () => {
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
        sphereRef.current.material.alpha = 0.2;
    });
    useKeyup('SLOW', () => {
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
        sphereRef.current.material.alpha = 0.5;
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
                sphereRef.current.isVisible = num % 2 === 0
            }
        }),
        () => {
            sphereRef.current.isVisible = true
        }
    ], []);

    useDoSequence(isInvulnerable, sphereRef, invulnerableTimings, invulnerableActions);

    const bombingTimings = useMemo(() => [0, 5.5], []);

    const bombingActions = useMemo(
        () => [
            () => {
                trailRef.current = new TrailMesh('sphere1Trail', sphereTransformRef.current, scene, 0.25, 30, true);
                const sourceMat = new StandardMaterial('sourceMat1', scene);
                const color = sideCoefficient === 1 ? new Color3.Red() : new Color3.White();
                sourceMat.emissiveColor = sourceMat.diffuseColor = color;
                sourceMat.specularColor = new Color3.Black();
                trailRef.current.material = sourceMat;
                trailRef.current.material.alpha = 0.5
                glowLayer.addIncludedOnlyMesh(trailRef.current)
            },
            () => {
                glowLayer.removeIncludedOnlyMesh(trailRef.current)
                trailRef.current.dispose();
            },
        ],
        [glowLayer, scene, sideCoefficient]
    );

    useDoSequence(isBombing, sphereRef, bombingTimings, bombingActions);

    useBeforeRender((scene) => {
        if (!sphereRef.current) return;

        const deltaS = scene.paused ? 0 : scene.getEngine().getDeltaTime() / 1000;
        sphereRef.current.rotate(z, sideCoefficient * deltaS, Space.WORLD);
    })

    return (
        <transformNode name={name + 'sphereTransform'} ref={sphereTransformRef} position={spherePosition}>
            {!isBombing && <UIClass position={UIPosition} />}
            <ReimuLinearBulletEmitter position={linearBulletEmitterPosition} powerClass={powerClass} />
            {powerClass > 0 && (
                <ReimuTrackingBulletEmitter initialVelocity={trackingInitialVelocity} powerClass={powerClass} />
            )}
            <sphere
                name={name + 'sphere'}
                scaling={new Vector3(0.5, 0.5, 0.5)}
                rotation={new Vector3(Math.PI / 4, 0, 0)}
                ref={sphereRef}
            >
                <standardMaterial alpha={0.5} name={name + 'sphereMat'}>
                    <texture assignTo="diffuseTexture" url={'/assets/player/reimu/yinyang.jpg'} />
                </standardMaterial>
            </sphere>
        </transformNode>
    )
}
