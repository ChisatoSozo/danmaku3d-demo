import { Matrix } from '@babylonjs/core';
import { makeName } from '../../hooks/useName';

export const makeKnifeMesh = (assets) => {
    const _mesh = assets.knife.instantiateModelsToScene(makeName).rootNodes[0];
    let matrix = Matrix.RotationX(Math.PI / 2);
    _mesh.bakeTransformIntoVertices(matrix);
    return _mesh;
};
