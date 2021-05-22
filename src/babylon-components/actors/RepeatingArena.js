import { Vector3 } from '@babylonjs/core';
import React, { useMemo, useRef } from 'react';
import { useBeforeRender } from 'react-babylonjs';
import { ClonedMesh } from '../actors/ClonedMesh';

export const RepeatingArena = ({ tileAssetNameA, tileAssetNameB, velocity }) => {
    const positions = useMemo(
        () => [new Vector3(0, 0, -125), new Vector3(0, 0, 0), new Vector3(0, 0, 125), new Vector3(0, 0, 250)],
        []
    );

    const transformNodeRef = useRef();

    useBeforeRender((scene) => {
        if (!transformNodeRef.current) return;

        const deltaS = scene.paused ? 0 : scene.getEngine().getDeltaTime() / 1000;
        transformNodeRef.current.position.addInPlace(velocity.scale(-deltaS));

        if (transformNodeRef.current.position.z < -200) {
            transformNodeRef.current.position.z += 250;
        }
    });

    return (
        <transformNode name="repeatingArena" ref={transformNodeRef}>
            <ClonedMesh assetName={tileAssetNameA} position={positions[0]} />
            <ClonedMesh assetName={tileAssetNameB} position={positions[1]} />
            <ClonedMesh assetName={tileAssetNameA} position={positions[2]} />
            <ClonedMesh assetName={tileAssetNameB} position={positions[3]} />
        </transformNode>
    );
};
