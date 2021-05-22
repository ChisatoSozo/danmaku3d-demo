import { useContext } from 'react';
import { AssetsContext } from '../gameLogic/GeneralContainer';

export const useTexture = (textureName) => {
    const assets = useContext(AssetsContext);
    return assets[textureName];
};
