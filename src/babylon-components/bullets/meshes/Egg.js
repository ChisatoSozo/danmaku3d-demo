import { Mesh } from '@babylonjs/core';
import { makeName } from '../../hooks/useName';

export const makeEggMesh = (assets) => {
    const _mesh = assets.egg.instantiateModelsToScene(makeName).rootNodes[0]._children[0];
    _mesh.overrideMaterialSideOrientation = Mesh.BACKSIDE
    _mesh.makeGeometryUnique();
    return _mesh;
};
