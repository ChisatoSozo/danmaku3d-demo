import React, { useEffect, useRef } from 'react';
import { Animation, Vector3 } from '@babylonjs/core';
import { useName } from '../../hooks/useName';
import { useAssets } from '../../hooks/useAssets';
import { useScene } from 'react-babylonjs';
import { makeActorFresnelMaterial } from './materials/ActorFresnel';

export const Tumbleweed = React.forwardRef(({ assetName, radius, ...props }, ref) => {;
    const name = useName('TumbleweedActor')
    const tumbleweedMesh = useAssets("tumbleweed", true);
    const transformNodeRef = useRef();
    const scene = useScene()

    useEffect(() => {
        Animation.CreateAndStartAnimation(
            name + "spinanim",
            ref.current,
            'rotation',
            2,
            1,
            new Vector3(0, 0, 0),
            new Vector3(0, 0, Math.PI * 2),
            Animation.ANIMATIONLOOPMODE_CYCLE,
        )
    }, [name, ref])

    useEffect(() => {
        if(!tumbleweedMesh) return;

        tumbleweedMesh.parent = transformNodeRef.current;
        const material = makeActorFresnelMaterial([1, 0, 0], scene)
        tumbleweedMesh.material = material;
    }, [scene, transformNodeRef, tumbleweedMesh])

    return (
        <transformNode name={name + "transform"} ref={ref} scaling={new Vector3(radius, radius, radius)} {...props}>
            <transformNode name={name + "offsetTransform"} ref={transformNodeRef} position={new Vector3(0, -0.5, 0)}>

            </transformNode>
        </transformNode>
    );
});
