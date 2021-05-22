import { makeName } from '../../hooks/useName';

export const makeItemMesh = (assets) => {
    const name = makeName('item');
    const _mesh = assets.item.clone(name);
    _mesh.makeGeometryUnique();

    return _mesh;
};
