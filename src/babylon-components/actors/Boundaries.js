import { Effect, ShaderMaterial, Vector3 } from '@babylonjs/core';
import React, { useEffect, useRef } from 'react';
import { useScene } from 'react-babylonjs';
import { ARENA_FLOOR, ARENA_HEIGHT, ARENA_LENGTH, ARENA_WIDTH } from '../../utils/Constants';
import { glsl } from '../BabylonUtils';

Effect.ShadersStore['boundariesVertexShader'] = glsl`
    attribute vec3 position;
    uniform mat4 world;
    uniform mat4 worldViewProjection;
    varying vec3 vPositionW;

    void main() {
        vPositionW = (world * vec4(position, 1.0)).xyz;
        gl_Position = worldViewProjection * vec4(position, 1.0);
    }
`;

Effect.ShadersStore['boundariesFragmentShader'] = glsl`
    varying vec3 vPositionW;
    uniform vec3 cameraPosition;


    void main() {

        float ring0 = float(distance(vPositionW, cameraPosition) < 1.5 && distance(vPositionW, cameraPosition) > 1.48);
        float ring1 = float(distance(vPositionW, cameraPosition) < 1.25 && distance(vPositionW, cameraPosition) > 1.23);
        float ring2 = float(distance(vPositionW, cameraPosition) < 1. && distance(vPositionW, cameraPosition) > 0.97);
        float ring3 = float(distance(vPositionW, cameraPosition) < 0.75 && distance(vPositionW, cameraPosition) > 0.72);

        float anyRing = max(max(ring0, ring1), max(ring2, ring3));

        vec4 color = vec4(1., 1., 1., anyRing);

        gl_FragColor = color;
    }
`;


const position = new Vector3(0, ((ARENA_HEIGHT + ARENA_FLOOR) / 2), 0)

export const Boundaries = () => {

    const boundaryRef = useRef()
    const scene = useScene()

    useEffect(() => {
        const mat = new ShaderMaterial(
            'boundariesMaterial',
            scene,
            {
                vertex: 'boundaries',
                fragment: 'boundaries',
            },
            {
                attributes: ['position'],
                uniforms: ['world', 'worldViewProjection', 'cameraPosition'],
                needAlphaBlending: true
            }
        )

        mat.backFaceCulling = false;
        boundaryRef.current.material = mat;
    }, [scene]);

    return (
        <box name="boundaries" width={ARENA_WIDTH + 1} height={ARENA_HEIGHT} depth={ARENA_LENGTH * 2} position={position} ref={boundaryRef} />
    )
}
