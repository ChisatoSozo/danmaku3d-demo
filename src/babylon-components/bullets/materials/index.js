import { makeDebugMaterial } from './Debug';
import { makeFresnelMaterial } from './Fresnel';
import { makeItemMaterial } from './Item';
import { makeTextureMaterial } from './Texture';

export const makeBulletMaterial = (materialOptions, parent, assets, scene) => {
    let _material;

    switch (materialOptions.material) {
        case 'fresnel':
            _material = makeFresnelMaterial(materialOptions, scene);
            break;
        case 'texture':
            _material = makeTextureMaterial(materialOptions, assets, scene);
            break;
        case 'item':
            _material = makeItemMaterial(materialOptions, assets, scene);
            break;
        case 'debug':
            _material = makeDebugMaterial(scene);
            break;
        default:
            throw new Error('Unsupported bullet material option: ' + materialOptions.material);
    }
    
    _material.backFaceCulling = !materialOptions.doubleSided;

    return _material;
};
