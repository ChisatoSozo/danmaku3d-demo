import {
    AssetsManager,

    DracoCompression,

    Matrix,
    Mesh,
    MeshBuilder,
    ParticleHelper,

    ParticleSystemSet
} from '@babylonjs/core';
import { useEffect, useState } from 'react';
import { useScene } from 'react-babylonjs';
import { nullVector } from '../../utils/Constants';
import { SETTINGS } from '../../utils/Settings';
import { capFirst } from '../../utils/Utils';

const qualityMap = {
    HI: {
        segments: 10,
        egg: "egg.glb"
    },
    MED: {
        segments: 6,
        egg: "egg_med.glb"
    },
    LOW: {
        segments: 3,
        egg: "egg_low.glb"
    }
}

export const useLoadAssets = () => {
    const scene = useScene();
    const [assets, setAssets] = useState();

    useEffect(() => {
        //Particles
        ParticleHelper.BaseAssetsUrl = '/assets/particles';
        ParticleSystemSet.BaseAssetsUrl = '/assets/particles';

        DracoCompression.Configuration = {
            decoder: {
                wasmUrl: '/assets/util/draco_wasm_wrapper_gltf.js',
                wasmBinaryUrl: '/assets/util/draco_decoder_gltf.wasm',
                fallbackUrl: '/assets/util/draco_decoder_gltf.js',
            },
        };

        const tempAssets = {};
        const assetList = [
            {
                rootUrl: '/assets/enemies/bosses/',
                sceneFilename: 'wriggle.glb',
                name: 'wriggle',
                type: 'model',
            },
            {
                rootUrl: '/assets/enemies/fairies/',
                sceneFilename: 'blueFairy.glb',
                name: 'blueFairy',
                type: 'model',
            },
            {
                rootUrl: '/assets/enemies/fairies/',
                sceneFilename: 'salmonFairy.glb',
                name: 'salmonFairy',
                type: 'model',
            },
            {
                rootUrl: '/assets/enemies/fairies/',
                sceneFilename: 'greenFairy.glb',
                name: 'greenFairy',
                type: 'model',
            },
            {
                rootUrl: '/assets/enemies/fairies/',
                sceneFilename: 'yellowFairy.glb',
                name: 'yellowFairy',
                type: 'model',
            },
            {
                rootUrl: '/assets/enemies/fairies/',
                sceneFilename: 'blueHatFairy.glb',
                name: 'blueHatFairy',
                type: 'model',
            },
            {
                rootUrl: '/assets/enemies/fairies/',
                sceneFilename: 'salmonHatFairy.glb',
                name: 'salmonHatFairy',
                type: 'model',
            },
            {
                rootUrl: '/assets/enemies/fairies/',
                sceneFilename: 'greenHatFairy.glb',
                name: 'greenHatFairy',
                type: 'model',
            },
            {
                rootUrl: '/assets/enemies/fairies/',
                sceneFilename: 'yellowHatFairy.glb',
                name: 'yellowHatFairy',
                type: 'model',
            },
            {
                rootUrl: '/assets/landscapes/stage1/',
                sceneFilename: 'landscapeTileAdraco.glb',
                name: 'stage1TileA',
                type: 'model',
            },
            {
                rootUrl: '/assets/landscapes/stage1/',
                sceneFilename: 'landscapeTileBdraco.glb',
                name: 'stage1TileB',
                type: 'model',
            },
            {
                url: '/assets/player/marisa/rune1.png',
                name: 'rune1',
                type: 'texture',
            },
            {
                url: '/assets/player/marisa/rune2.png',
                name: 'rune2',
                type: 'texture',
            },
            {
                url: '/assets/player/marisa/rune3.png',
                name: 'rune3',
                type: 'texture',
            },
            {
                url: '/assets/player/marisa/rune4.png',
                name: 'rune4',
                type: 'texture',
            },
            {
                url: '/assets/player/marisa/runeEmpty.png',
                name: 'runeEmpty',
                type: 'texture',
            },
            {
                url: '/assets/enemies/textures/blueMagicCircle.png',
                name: 'blueMagicCircle',
                type: 'texture',
            },
            {
                url: '/assets/bullets/ofuda/reimu_ofuda.jpg',
                name: 'reimu_ofuda',
                type: 'texture',
            },
            {
                url: '/assets/bullets/ofuda/reimu_ofuda_blue.jpg',
                name: 'reimu_ofuda_blue',
                type: 'texture',
            },
            {
                url: '/assets/player/reimu/reimuDeath.png',
                name: 'reimuDeath',
                type: 'texture',
            },
            {
                url: '/assets/player/marisa/marisaDeath.png',
                name: 'marisaDeath',
                type: 'texture',
            },
            {
                url: '/assets/items/point.png',
                name: 'point',
                type: 'texture',
            },
            {
                url: '/assets/crossHair/crosshair.png',
                name: 'crosshair',
                type: 'texture'
            },
            {
                url: '/assets/crossHair/targeting.png',
                name: 'targeting',
                type: 'texture'
            },
            {
                url: '/assets/items/power.png',
                name: 'power',
                type: 'texture',
            },
            {
                url: '/assets/items/fullpower.png',
                name: 'fullpower',
                type: 'texture',
            },
            {
                url: '/assets/items/bomb.png',
                name: 'bomb',
                type: 'texture',
            },
            {
                url: '/assets/items/1up.png',
                name: '1up',
                type: 'texture',
            },
            {
                rootUrl: '/assets/bullets/knife/',
                sceneFilename: 'knife.glb',
                name: 'knife',
                type: 'model',
            },
            {
                rootUrl: '/assets/enemies/tumbleweeds/',
                sceneFilename: 'tumbleweed.glb',
                name: 'tumbleweed',
                type: 'model',
            },
            {
                rootUrl: '/assets/player/marisa/broomstick/',
                sceneFilename: 'broom.glb',
                name: 'broomstick',
                type: 'model',
            },
            {
                rootUrl: '/assets/player/marisa/beam/',
                sceneFilename: 'beam.glb',
                name: 'beam',
                type: 'model',
            },
            {
                rootUrl: '/assets/bullets/marisaBullet/',
                sceneFilename: 'marisaBullet.glb',
                name: 'marisaBullet',
                type: 'model',
            },
            {
                rootUrl: '/assets/bullets/egg/',
                sceneFilename: qualityMap[SETTINGS.QUALITY].egg,
                name: 'egg',
                type: 'model',
            },
            {
                type: 'function',
                name: 'sphere',
                generator: () => {
                    const mesh = MeshBuilder.CreateSphere(
                        'sphere',
                        {
                            diameter: 2,
                            segments: qualityMap[SETTINGS.QUALITY].segments,
                            updatable: false,
                        },
                        scene
                    );

                    mesh.isVisible = false;
                    return mesh;
                },
            },
            {
                type: 'function',
                name: 'plane',
                generator: () => {
                    const plane = MeshBuilder.CreatePlane(
                        'plane',
                        {
                            width: 3,
                            height: 3,
                            updatable: false,
                        },
                        scene
                    );
                    plane.isVisible = false;
                    return plane;
                },
            },
            {
                type: 'function',
                name: 'sphereWithHalo',
                generator: () => {
                    const meshInner = MeshBuilder.CreateSphere(
                        'sphereWithHaloInner',
                        {
                            diameter: 1.5,
                            segments: qualityMap[SETTINGS.QUALITY].segments,
                        },
                        scene
                    );
                    const meshOuter = MeshBuilder.CreateTorus(
                        'sphereWithHaloOuter',
                        {
                            diameter: 2.0,
                            thickness: 0.1,
                            tessellation: qualityMap[SETTINGS.QUALITY].segments * 2,
                        },
                        scene
                    );

                    const rotationMatrix = Matrix.RotationX(Math.PI / 2);
                    meshOuter.bakeTransformIntoVertices(rotationMatrix);

                    const mesh = Mesh.MergeMeshes([meshInner, meshOuter], true);

                    mesh.isVisible = false;
                    return mesh;
                },
            },
            {
                type: 'function',
                name: 'card',
                generator: () => {
                    const mesh = MeshBuilder.CreatePlane(
                        'card',
                        {
                            width: 0.3,
                            height: 0.6,
                            updatable: true,
                        },
                        scene
                    );
                    const matrixX = Matrix.RotationX(Math.PI / 2);
                    const matrixZ = Matrix.RotationZ(Math.PI / 2);

                    const matrix = matrixX.multiply(matrixZ);
                    mesh.bakeTransformIntoVertices(matrix);
                    mesh.isVisible = false;
                    return mesh;
                },
            },
            {
                type: 'function',
                name: 'item',
                generator: () => {
                    const mesh = MeshBuilder.CreatePlane(
                        'item',
                        {
                            width: 0.25,
                            height: 0.25,
                            updatable: true,
                        },
                        scene
                    );
                    mesh.isVisible = false;
                    return mesh;
                },
            },
        ];

        ["deathParticles",
            "wriggleDeathParticles",
            "newPhaseWriggleParticles",
            "hitParticles",
            "chargeBombReimuParticles",
            "chargeBombMarisaParticles",
            "fireflyParticles",
            "fireflyParticles2",
            "chargeWriggleParticles",].forEach(particle => {
                assetList.push({
                    json: particle,
                    name: particle,
                    type: 'particles',
                })
            });

        ['reimu', 'marisa', 'wriggle'].forEach((name) =>
            ['angry', 'dissapoint', 'excited', 'neutral', 'shocked', 'special', 'tired'].forEach((emotion) =>
                assetList.push({
                    url: `/assets/characterPortraits/${name}/${emotion}.png`,
                    name: `${name}Character${capFirst(emotion)}`,
                    type: 'texture',
                    postProcess: (texture) => {
                        if (name === 'marisa') {
                            texture.uScale = -1;
                        }
                        texture.vScale = 0.99;
                    },
                })
            )
        );

        const assetsManager = new AssetsManager(scene);

        assetList.forEach((asset) => {
            let assetTask;

            switch (asset.type) {
                case 'particles':
                    new ParticleHelper.CreateAsync(asset.json, scene, false).then(function (set) {
                        set.systems[0].emitter = nullVector;
                        set.systems[0].start();
                        tempAssets[asset.name] = set.systems[0];
                    });
                    break;
                case 'texture':
                    assetTask = assetsManager.addTextureTask(asset.name, asset.url);
                    assetTask.onSuccess = (task) => {
                        task.texture.hasAlpha = true;

                        if (asset.postProcess) {
                            asset.postProcess(task.texture);
                        }
                        tempAssets[task.name] = task.texture;
                    };
                    break;
                case 'function':
                    tempAssets[asset.name] = asset.generator();
                    break;
                case 'model':
                    assetTask = assetsManager.addContainerTask(asset.name, '', asset.rootUrl, asset.sceneFilename);
                    assetTask.onSuccess = (task) => {
                        tempAssets[task.name] = task.loadedContainer;
                    };
                    break;
                default:
                    throw new Error('Invalid asset type: ' + asset.type);
            }

            if (!assetTask) return;
            assetTask.onError = (error) => {
                console.error(error);
            };
        });

        assetsManager.onFinish = async () => {
            setAssets(tempAssets);
        };

        assetsManager.load();
    }, [scene]);

    return assets;
};
