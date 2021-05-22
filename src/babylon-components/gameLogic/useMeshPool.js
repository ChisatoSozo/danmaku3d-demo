import { Animation, Color3, EasingFunction, SineEase, StandardMaterial, Vector3 } from '@babylonjs/core';
import { useCallback } from 'react';
import { useScene } from 'react-babylonjs';
import { nullVector } from '../../utils/Constants';
import { TrailMesh } from '../TrailMesh';
import { glowLayerRef } from "./useGlowLayer";

const meshPoolRef = {
    current: false
}

const fillMeshPool = (scene, assets) => {
    if (!glowLayerRef.current) throw new Error("glowLayer must be initialized before meshPool")

    const meshPool = {};
    //MINIONS

    meshPool.minion = {
        index: 0,
        meshes: [],
    };

    const texture = assets["blueMagicCircle"]
    const planeMat = new StandardMaterial()
    planeMat.useAlphaFromDiffuseTexture = true;
    planeMat.disableLighting = true
    planeMat.backFaceCulling = false
    planeMat.name = "magicCirlceMat"
    planeMat.diffuseTexture = texture
    planeMat.emissiveTexture = texture

    const sphereMat = new StandardMaterial()
    sphereMat.disableLighting = true
    sphereMat.name = "minionMat"
    sphereMat.emissiveColor = new Color3(1, 1, 1)

    const trailMat = new StandardMaterial("trailMat", scene);
    const matColor = new Color3(1, 1, 1);
    trailMat.emissiveColor = trailMat.diffuseColor = matColor;
    trailMat.specularColor = new Color3.Black();

    const minionPlane = assets.plane.clone("minionPlane");
    const minionSphere = assets.sphere.clone("minionSphere");
    minionPlane.material = planeMat;
    minionSphere.material = sphereMat;

    for (let i = 0; i < 40; i++) {
        const planeMesh = minionPlane.createInstance(i + "minionPlane");
        const sphereMesh = minionSphere.createInstance(i + "minionSphere");

        planeMesh.isVisible = true;
        sphereMesh.isVisible = true;
        planeMesh.scaling = new Vector3(2, 2, 2);

        const trail = new TrailMesh(i + "minionTrail", sphereMesh, scene, 0.25, 30, false);
        trail.material = trailMat;

        planeMesh.parent = sphereMesh;

        sphereMesh.position = nullVector;
        sphereMesh.onBegin = (args) => {
            if (args.disableTrail) return;
            trail.position = new Vector3(0, 0, 0);
            glowLayerRef.current.addIncludedOnlyMesh(trail)
        };

        sphereMesh.onEnd = (args) => {
            if (args.disableTrail) return;
            trail.stop(true);
            glowLayerRef.current.removeIncludedOnlyMesh(trail)
        };

        sphereMesh.trail = trail;
        sphereMesh.poolDispose = sphereMesh.dispose;
        sphereMesh.dispose = () => { };
        sphereMesh.onDispose = console.warn;

        sphereMesh.isPooled = true;
        meshPool.minion.meshes.push(sphereMesh);
    }

    //TARGETS

    meshPool.target = {
        index: 0,
        meshes: [],
    };

    const targetTexture = assets["targeting"]
    const targetPlane = assets.plane.clone("targetPlane");
    const targetMaterial = new StandardMaterial("targetMat", scene);
    targetMaterial.disableLighting = true
    targetMaterial.useAlphaFromDiffuseTexture = true
    targetMaterial.diffuseTexture = targetTexture
    targetMaterial.emissiveColor = new Color3(0.8, 0, 0)
    targetMaterial.backFaceCulling = false;
    targetPlane.material = targetMaterial;
    targetPlane.renderingGroupId = 1;

    for (let i = 0; i < 50; i++) {
        const targetMesh = targetPlane.createInstance(i + "targetPlane");

        targetMesh.isVisible = true;
        targetMesh.position = new Vector3(-510, -510, -510);

        const sineAnimation = new Animation(i + "sineAnimation", "scaling", 30, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CYCLE);
        const keysSineAnimation = [];
        keysSineAnimation.push({ frame: 0, value: new Vector3(1, 1, 1) });
        keysSineAnimation.push({ frame: 30, value: new Vector3(1.1, 1.1, 1.1) });
        keysSineAnimation.push({ frame: 60, value: new Vector3(1, 1, 1) });
        sineAnimation.setKeys(keysSineAnimation);

        const cubicEasing = new SineEase();
        cubicEasing.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT)
        sineAnimation.setEasingFunction(cubicEasing);
        targetMesh.animations.push(sineAnimation);

        targetMesh.onBegin = () => {
            scene.beginAnimation(targetMesh, 0, 60, true);
            glowLayerRef.current.addIncludedOnlyMesh(targetMesh)
        };

        targetMesh.onEnd = () => {
            scene.stopAnimation(targetMesh);
            glowLayerRef.current.removeIncludedOnlyMesh(targetMesh)
        };

        targetMesh.isPooled = true;
        meshPool.target.meshes.push(targetMesh);
    }

    meshPool.sphere = {
        index: 0,
        meshes: [],
    };


    for (let i = 0; i < 100; i++) {
        const sphere = assets.sphere.clone(i + "sphere");
        sphere.makeGeometryUnique();
        sphere.isPooled = true;
        meshPool.sphere.meshes.push(sphere);
    }

    return meshPool
}

export const useMeshPool = (assets) => {
    const scene = useScene();

    if (!meshPoolRef.current && assets) meshPoolRef.current = fillMeshPool(scene, assets);

    const getMesh = useCallback((type, args = {}) => {
        if (!meshPoolRef.current) throw new Error("mesh pool isn't ready")
        const pool = meshPoolRef.current[type]
        const newMesh = pool.meshes[pool.index];
        if (newMesh.onBegin) newMesh.onBegin(args)

        pool.index = (pool.index + 1) % pool.meshes.length;
        newMesh.position = new Vector3(0, 0, 0);
        return newMesh;
    }, [])

    const releaseMesh = useCallback((mesh, args = {}) => {
        if (!meshPoolRef.current) throw new Error("mesh pool isn't ready")
        if (mesh.onEnd) mesh.onEnd(args);
        mesh.parent = null;
        mesh.position = new Vector3(-510, -510, -510);
    }, [])

    return { getMesh, releaseMesh };
}
