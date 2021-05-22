import { Matrix } from '@babylonjs/core';
import { MAX_BULLETS_PER_GROUP } from '../../../utils/Constants';
import { makeCardMesh } from './Card';
import { makeEggMesh } from './Egg';
import { makeItemMesh } from './Item';
import { makeKnifeMesh } from './Knife';
import { makeMarisaBulletMesh } from './MarisaBullet';
import { makeSphereMesh } from './Sphere';
import { makeSphereWithHaloMesh } from './SphereWithHalo';

export const bufferMatricesPreCompute = new Float32Array(MAX_BULLETS_PER_GROUP * 16);
for (let i = 0; i < MAX_BULLETS_PER_GROUP; i++) {
    const matrix = Matrix.Identity();
    matrix.copyToArray(bufferMatricesPreCompute, i * 16);
};

export const makeBulletMesh = (meshOptions, assets, getMesh) => {
    const { mesh, radius } = meshOptions;

    let _mesh;

    switch (mesh) {
        case 'sphere':
            _mesh = makeSphereMesh(getMesh);
            break;
        case 'sphereWithHalo':
            _mesh = makeSphereWithHaloMesh(assets);
            break;
        case 'egg':
            _mesh = makeEggMesh(assets);
            break;
        case 'card':
            _mesh = makeCardMesh(assets);
            break;
        case 'item':
            _mesh = makeItemMesh(assets);
            break;
        case 'knife':
            _mesh = makeKnifeMesh(assets);
            break;
        case 'marisaBullet':
            _mesh = makeMarisaBulletMesh(assets);
            break;
        default:
            throw new Error('Mesh type not supported: ' + meshOptions.mesh);
    }

    _mesh.alwaysSelectAsActiveMesh = true;
    _mesh.doNotSyncBoundingInfo = true;
    _mesh.isVisible = true;


    _mesh.makeInstances = (num) => {
        if (num > MAX_BULLETS_PER_GROUP) throw new Error("MAX_BULLETS_PER_GROUP is " + MAX_BULLETS_PER_GROUP + " You have " + num)
        _mesh.thinInstanceSetBuffer("matrix", bufferMatricesPreCompute.slice(0, num * 16), 16);
    }

    return { mesh: _mesh, radius };
};
