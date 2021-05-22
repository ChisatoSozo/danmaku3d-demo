import { makeName } from '../../hooks/useName';

export const makeSphereWithHaloMesh = (assets) => {
    const name = makeName('sphereWithHalo');
    const _mesh = assets.sphereWithHalo.clone(name);
    _mesh.makeGeometryUnique();
    return _mesh;
};
