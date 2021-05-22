import React, { useEffect, useRef } from 'react';
import { useAssets } from '../hooks/useAssets';
import { useName } from '../hooks/useName';

export const ClonedMesh = ({ assetName, children, ...props }) => {
    const transformNodeRef = useRef();
    const mesh = useAssets(assetName);
    const name = useName(assetName);

    useEffect(() => {
        if (!mesh) return;
        mesh.parent = transformNodeRef.current;
    }, [mesh]);

    return <transformNode name={name} ref={transformNodeRef} {...props}>
        {children}
    </transformNode>;
};
