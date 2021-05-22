import { Matrix } from "@babylonjs/core";
import { makeName } from "../../hooks/useName";

export const makeMarisaBulletMesh = (assets) => {
    const _mesh = assets.marisaBullet.instantiateModelsToScene(makeName).rootNodes[0]._children[0];
    _mesh.makeGeometryUnique();
    const scaleMatrix = Matrix.Scaling(0.75, 0.75, 1);
    _mesh.bakeTransformIntoVertices(scaleMatrix);
    return _mesh;
}