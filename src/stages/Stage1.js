import { Color3, Scene, Vector3 } from '@babylonjs/core';
import '@babylonjs/loaders';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useScene } from 'react-babylonjs';
import { RepeatingArena } from '../babylon-components/actors/RepeatingArena';
import { Enemies } from '../babylon-components/enemies/Enemies';
import { makeActionListTimeline } from '../babylon-components/enemies/EnemyUtils';
import { BulletsContext } from '../babylon-components/gameLogic/GeneralContainer';
import { UIExecutor } from '../babylon-components/ui/UIExecutor';
import Music from '../sounds/Music';
import stage1def from './stage1def';
import { setupStage1 } from './Stage1Setup';

export const Stage1 = () => {
    const scene = useScene();
    const [epochIndex, setEpochIndex] = useState(0);
    const stageSource = useMemo(() => stage1def(), []);
    const currentActionList = useMemo(() => makeActionListTimeline(stageSource.epochs[epochIndex]), [stageSource, epochIndex]);
    const enemyActionList = useMemo(() => currentActionList.filter((action) => action.type === 'enemies'), [currentActionList]);
    const UIActionList = useMemo(() => currentActionList.filter((action) => action.type === 'UI'), [currentActionList]);
    const { preComputeBulletGroup } = useContext(BulletsContext);

    useEffect(() => {
        scene.fogMode = Scene.FOGMODE_LINEAR;
        scene.fogStart = 70.0;
        scene.fogEnd = 100.0;
        scene.fogColor = new Color3(0.1, 0.1, 0.2);
        setupStage1(preComputeBulletGroup);
    }, [preComputeBulletGroup, scene]);

    useEffect(() => {
        Music.play('stage1Theme');
    }, []);

    return (
        <>
            <UIExecutor currentActionList={UIActionList} setEpochIndex={setEpochIndex} />
            <Enemies currentActionList={enemyActionList} setEpochIndex={setEpochIndex} />
            <RepeatingArena tileAssetNameA="stage1TileA" tileAssetNameB="stage1TileB" velocity={new Vector3(0, 0, 10)} />
            <hemisphericLight name="light1" intensity={0.2} direction={Vector3.Up()} />
            <directionalLight
                name="dl"
                intensity={0.5}
                direction={new Vector3(0, -0.5, 0.5)}
                position={new Vector3(0, 50, 5)}
            ></directionalLight>
        </>
    );
};
