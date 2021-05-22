import { Animation, Vector3 } from '@babylonjs/core';
import React, { useEffect, useMemo } from 'react';
import { useMeshPool } from '../../gameLogic/useMeshPool';
import { useName } from '../../hooks/useName';

export const MinionBase = React.forwardRef(({ radius = 0.5, ...props }, ref) => {
    const name = useName("minionBase")
    const scaling = useMemo(() => new Vector3(radius, radius, radius), [radius]);
    const { getMesh, releaseMesh } = useMeshPool();

    useEffect(() => {
        const minionMesh = getMesh("minion", { disableTrail: props.disableTrail })
        minionMesh.parent = ref.current;
        if (!props.disableTrail) minionMesh.trail.start(true);
        minionMesh.scaling = scaling;

        Animation.CreateAndStartAnimation(
            name + "anim",
            minionMesh,
            'rotation',
            1,
            8,
            new Vector3(0, 0, 0),
            new Vector3(0, 0, Math.PI * 2),
            Animation.ANIMATIONLOOPMODE_CYCLE,
        )

        return () => {
            releaseMesh(minionMesh, { disableTrail: props.disableTrail });
        }
    }, [getMesh, name, props.disableTrail, ref, releaseMesh, scaling])

    return (
        <transformNode ref={ref} scaling={scaling} name={name} {...props} />
    );
});
