import { Vector3 } from '@babylonjs/core';
import React, { useMemo, useState } from 'react';
import { useBeforeRender } from 'react-babylonjs';
import { allSyncs } from '../CustomCustomProceduralTexture';
import { useBullets } from './useBullets';
import { useEffects } from './useEffects';
import { useGlowLayer } from './useGlowLayer';
import { useLoadAssets } from './useLoadAssets';
import { useMeshPool } from './useMeshPool';
import { usePause } from './usePause';
import { useUI } from './useUI';

export const BulletsContext = React.createContext();
export const EffectsContext = React.createContext();
export const AssetsContext = React.createContext();
export const TargetContext = React.createContext();
export const UIContext = React.createContext();
export const PauseContext = React.createContext();
export const AnimationContext = React.createContext();

export const GeneralContainer = ({ children }) => {
    const target = useMemo(() => new Vector3(0, 0, 10), []);
    const [environmentCollision, setEnvironmentCollision] = useState(new Vector3(1, 0, 0));
    const [isDead, setIsDead] = useState(false);
    const assets = useLoadAssets();
    const addEffect = useEffects(assets);
    const bulletsObject = useBullets(assets, environmentCollision, addEffect, isDead, setIsDead);
    const UIProps = useUI();
    useGlowLayer();
    useMeshPool(assets);
    const { registerAnimation, unregisterAnimation, ...pauseProps } = usePause();

    //Supports readpixels
    useBeforeRender((scene) => {
        const gl = scene.getEngine()._gl;

        const newSyncs = [];

        allSyncs.syncs.forEach((sync) => {
            var res = gl.clientWaitSync(sync.sync, 0, 0);
            if (res === gl.WAIT_FAILED) {
                sync.promiseReject();
                return;
            }
            if (res === gl.TIMEOUT_EXPIRED) {
                newSyncs.push(sync);
                return;
            }

            gl.deleteSync(sync.sync);
            gl.bindBuffer(gl.PIXEL_PACK_BUFFER, sync.PPB);
            gl.getBufferSubData(gl.PIXEL_PACK_BUFFER, 0, sync.buffer);
            gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);

            sync.promiseResolve(sync.buffer);
        });

        allSyncs.syncs = newSyncs;
    });

    return assets ? (
        <AssetsContext.Provider value={assets}>
            <BulletsContext.Provider value={{ ...bulletsObject, setEnvironmentCollision }}>
                <EffectsContext.Provider value={addEffect}>
                    <TargetContext.Provider value={target}>
                        <UIContext.Provider value={{ isDead, setIsDead, ...UIProps }}>
                            <PauseContext.Provider value={pauseProps}>
                                <AnimationContext.Provider value={{ registerAnimation, unregisterAnimation }}>{children}</AnimationContext.Provider>
                            </PauseContext.Provider>
                        </UIContext.Provider>
                    </TargetContext.Provider>
                </EffectsContext.Provider>
            </BulletsContext.Provider>
        </AssetsContext.Provider>
    ) : (
        <camera name="fallbackCamera" position={new Vector3(0, 0, 0)} />
    );
};
