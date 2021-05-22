import React from 'react';
import { Vector3 } from '@babylonjs/core';
import { useName } from '../../hooks/useName';

export const TempActor = React.forwardRef(({ assetName, radius, ...props }, ref) => {
    const transBaseName = useName('tempActorTransformBase');
    const transCubeName = useName('tempActorTransformCube');

    return (
        <transformNode name={transBaseName} ref={ref} {...props}>
            <plane
                name={transCubeName}
                scaling={new Vector3(radius, radius, radius)}
            />
        </transformNode>
    );
});
