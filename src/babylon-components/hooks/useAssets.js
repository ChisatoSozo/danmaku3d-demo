import { useContext, useEffect, useState } from 'react';
import { AssetsContext } from '../gameLogic/GeneralContainer';

export const useAssets = (name, extractChild = false) => {
    const assets = useContext(AssetsContext);

    let [result, setResult] = useState();

    useEffect(() => {
        const container = assets[name];
        const newInstance = container.instantiateModelsToScene();
        const mesh = extractChild ? newInstance.rootNodes[0]._children[0] : newInstance.rootNodes[0];
        mesh.animationGroups = newInstance.animationGroups;
        mesh.animationSkeleton = newInstance.skeletons[0];

        setResult(mesh);
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assets]);

    return result;
};
