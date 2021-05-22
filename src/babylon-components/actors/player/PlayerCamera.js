import { Matrix, Quaternion, Vector3 } from '@babylonjs/core';
import React, { useCallback, useEffect, useRef } from 'react';
import { useBeforeRender, useEngine } from 'react-babylonjs';
import { TARGET_LENGTH } from '../../../utils/Constants';
import { useTarget } from '../../hooks/useTarget';
import { useTexture } from '../../hooks/useTexture';

export const PlayerCamera = () => {
    const engine = useEngine();
    const canvas = engine.getRenderingCanvas();
    const cameraRef = useRef();
    const transformNodeRef = useRef();
    const targetRef = useRef();
    const target = useTarget();
    const texture = useTexture('crosshair');

    const cameraHandler = useCallback((e) => {
        if (!transformNodeRef.current) return;

        const x = e.offsetX;
        const y = e.offsetY;
        const width = e.target.offsetWidth;
        const height = e.target.offsetHeight;

        const right = x / width - 0.5;
        const up = y / height - 0.5;

        let upM = Matrix.RotationX(Math.PI * up);
        let rightM = Matrix.RotationY(Math.PI * right);

        let matrix = Matrix.Identity().multiply(upM).multiply(rightM);

        const _ = new Vector3();
        const rotation = new Quaternion();

        matrix.decompose(_, rotation);

        transformNodeRef.current.rotationQuaternion = rotation;
    }, []);

    useEffect(() => {
        if (!canvas) return;
        canvas.addEventListener('pointermove', cameraHandler);

        return () => {
            canvas.removeEventListener('pointermove', cameraHandler);
        };
    }, [canvas, cameraHandler]);

    useBeforeRender(() => {
        if (!targetRef.current) return;
        target.copyFrom(targetRef.current.getAbsolutePosition());
    });

    return (
        <transformNode ref={transformNodeRef} name="cameraTransform" position={new Vector3(0, 0, 0)}>
            <transformNode ref={targetRef} name="targetTransform" position={new Vector3(0, 0, TARGET_LENGTH)}>
                <plane position={new Vector3(0, 0, -(TARGET_LENGTH - 1))} renderingGroupId={1} width={0.03} height={0.03} name="targetPlane">
                    <standardMaterial
                        useAlphaFromDiffuseTexture
                        disableLighting={true}
                        name={'targetMat'}
                        diffuseTexture={texture}
                        emissiveTexture={texture} />
                </plane>
            </transformNode>
            <targetCamera fov={1.0472} ref={cameraRef} name="camera" minZ={0.01} maxZ={100} position={new Vector3(0, 0, 0)} />
        </transformNode>
    );
};
