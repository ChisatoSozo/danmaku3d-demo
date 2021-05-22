import { Vector3 } from '@babylonjs/core';
import { clamp } from 'lodash';
import React, { useEffect, useRef } from 'react';
import { useBeforeRender } from 'react-babylonjs';
import { useAssets } from '../../hooks/useAssets';
import { useName } from '../../hooks/useName';

export const FairyBase = React.forwardRef(({ asset, radius, ...props }, ref) => {
    const transBaseName = useName('fairyTransformBase');
    const transOffsetName = useName('fairyTransformOffset');
    const meshRootRef = useRef();
    const mesh = useAssets(asset);

    useEffect(() => {
        if (!mesh) return;
        mesh.parent = meshRootRef.current;
        mesh.animationGroups.forEach((animationGroup) => {
            switch (animationGroup.name) {
                case 'fly':
                    mesh.animFly = animationGroup;
                    break;
                default:
                    break;
            }
        });

        mesh.animFly.start(true);
        mesh.dressBone = mesh.animationSkeleton.bones.filter((bone) => bone.name === 'dress')[0];
    }, [mesh]);

    useBeforeRender((scene) => {
        if (!mesh) return;
        if (!ref.current) return;

        if (!ref.current.lastPosition) {
            ref.current.lastPosition = ref.current.getAbsolutePosition().clone();
            return;
        }

        if (scene.paused) return;

        const deltaS = scene.paused ? 0 : scene.getEngine().getDeltaTime() / 1000;
        const curPosition = ref.current.getAbsolutePosition();
        const dPosition = curPosition.subtract(ref.current.lastPosition).scale(0.15 / deltaS);
        ref.current.lastPosition = curPosition.clone();

        if (!mesh.animFly) return;
        mesh.animFly.speedRatio = dPosition.length() * (0.01 / deltaS) + 0.5;

        if (!mesh.dressBone) return;

        const rotX = clamp(dPosition.z * -1, -Math.PI / 2, Math.PI / 2);
        const rotZ = clamp(dPosition.x * 1, -Math.PI / 2, Math.PI / 2);

        mesh.dressBone.rotation = new Vector3(Math.PI + rotX, 0, rotZ);
    });

    return (
        <transformNode name={transBaseName} ref={ref} {...props}>
            <transformNode
                name={transOffsetName}
                ref={meshRootRef}
                scaling={new Vector3(radius, radius, radius)}
                rotation={new Vector3(0, Math.PI, 0)}
                position={new Vector3(0, -1 * radius, 0)}
            />
        </transformNode>
    );
});
