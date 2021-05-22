import { makeName } from '../../hooks/useName';

export const makeCardMesh = (assets) => {
    const name = makeName('card');
    const _mesh = assets.card.clone(name);
    _mesh.makeGeometryUnique();

    return _mesh;
};
