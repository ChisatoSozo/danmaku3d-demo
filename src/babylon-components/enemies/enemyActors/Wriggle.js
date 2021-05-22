import { AnimationPropertiesOverride, Vector3 } from '@babylonjs/core';
import React, { useEffect, useRef } from 'react';
import { useBeforeRender } from 'react-babylonjs';
import { useAssets } from '../../hooks/useAssets';
import { useName } from '../../hooks/useName';

export const Wriggle = React.forwardRef(({ assetName, radius, ...props }, ref) => {
    const transBaseName = useName('fairyTransformBase');
    const transOffsetName = useName('fairyTransformOffset');
    const meshRootRef = useRef();
    const mesh = useAssets("wriggle")

    useEffect(() => {
        if (!mesh) return;
        mesh.parent = meshRootRef.current;
        mesh.animationGroups.forEach((animationGroup) => {
            animationGroup.animatables.forEach(animatable => animatable.enableBlending(0.02))
            switch (animationGroup.name) {
                case 'Idle':
                    mesh.animIdle = animationGroup;
                    break;
                case 'Drift':
                    mesh.animLeft = animationGroup;
                    break;
                case 'Drift2':
                    mesh.animRight = animationGroup;
                    break;
                case 'Blast':
                    mesh.animAttack = animationGroup;
                    break;
                default:
                    break;
            }
        });

        mesh.animIdle.start(true);

        const animationPropertiesOverride = new AnimationPropertiesOverride();
        animationPropertiesOverride.enableBlending = true;
        animationPropertiesOverride.blendingSpeed = 0.02;
        mesh.animationSkeleton.animationPropertiesOverride = animationPropertiesOverride;
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

        if (dPosition.x > 0.3) {
            mesh.animLeft.start(true);
            mesh.animRight.stop();
            mesh.animIdle.stop();
        }
        else if (dPosition.x < -0.3) {
            mesh.animRight.start(true);
            mesh.animLeft.stop();
            mesh.animIdle.stop();
        } else {
            mesh.animIdle.start(true);
            mesh.animRight.stop();
            mesh.animLeft.stop()
        }
    });


    return (
        <transformNode name={transBaseName} ref={ref} {...props}>
            <transformNode
                name={transOffsetName}
                ref={meshRootRef}
                scaling={new Vector3(radius, radius, radius)}
                rotation={new Vector3(0, 0, 0)}
                position={new Vector3(0, -1 * radius, 0)}
            />
        </transformNode>
    );
});
