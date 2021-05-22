import { Vector3 } from '@babylonjs/core';
import React, { useMemo, useRef } from 'react';
import { randVectorToPosition } from '../../BabylonUtils';

export const InertMinionBehaviour = ({ children, spawn}) => {
    const transformNodeRef = useRef();
    const startPosition = useMemo(() => spawn ? randVectorToPosition(spawn) : new Vector3(0, 0, 0), [spawn]);

    return (
        <transformNode name position={startPosition} ref={transformNodeRef}>
            {children}
        </transformNode>
    );
};
