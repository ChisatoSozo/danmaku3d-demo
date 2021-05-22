import { Color3, ShaderMaterial } from '@babylonjs/core';
import { v4 } from 'uuid';
import { glsl } from '../../../BabylonUtils';

export const actorFresnelVertexShader = glsl`
    attribute vec3 position;
    attribute vec3 normal;
    attribute vec2 uv;
    uniform mat4 world;
    uniform mat4 worldViewProjection;
    varying vec3 vPositionW;
    varying vec3 vNormalW;

    #include<helperFunctions>

    void main() {
        vPositionW = (world * vec4(position, 1.0)).xyz;

        mat3 normalMatrix = transposeMat3(inverseMat3(mat3(world)));
        vNormalW = normalMatrix * normal;
        gl_Position = worldViewProjection * vec4(position, 1.0);
    }
`;
export const actorFresnelFragmentShader = glsl`
    uniform vec3 toColor;
    varying vec3 vPositionW;
    varying vec3 vNormalW;
    uniform vec3 cameraPosition;

    void main() {

        vec3 from = vec3(1., 1., 1.);
        vec3 viewDirectionW = normalize(cameraPosition - vPositionW);
        float fresnelTerm = dot(viewDirectionW, vNormalW);
        fresnelTerm = clamp(1. - fresnelTerm, 0., 1.0);

        vec4 color = vec4(mix(from, toColor, fresnelTerm), 1.);


        gl_FragColor = color;
    }
`;

export const makeActorFresnelMaterial = (color, scene) => {
    const _material = new ShaderMaterial(
        v4() + 'actorFresnel',
        scene,
        {
            vertex: 'actorFresnel',
            fragment: 'actorFresnel',
        },
        {
            attributes: ['position', 'normal', 'uv', 'world0', 'world1', 'world2', 'world3'],
            uniforms: ['worldView', 'world', 'worldViewProjection', 'view', 'projection', 'direction', 'cameraPosition']
        }
    );
    
    const matColor = color || [1.0, 0.0, 0.0]
    _material.setColor3("toColor", new Color3(...matColor))

    return _material;
};
