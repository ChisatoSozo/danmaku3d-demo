import { Vector3 } from '@babylonjs/core';
import { useEffect, useMemo, useRef } from 'react';
import { useMeshPool } from '../../gameLogic/useMeshPool';
import { useName } from '../../hooks/useName';

export const Targeting = ({ radius }) => {
    const { getMesh, releaseMesh } = useMeshPool();
    const transformNodeRef = useRef();
    const scaling = useMemo(() => new Vector3(radius, radius, radius), [radius]);
    const name = useName('Targeting')

    useEffect(() => {
        const target = getMesh("target")
        target.parent = transformNodeRef.current

        return () => {
            releaseMesh(target)
        }
    }, [getMesh, radius, releaseMesh])


    return <transformNode name={name} scaling={scaling} ref={transformNodeRef} />
}
