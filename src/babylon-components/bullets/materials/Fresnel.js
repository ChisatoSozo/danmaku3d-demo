import { Color3, ShaderMaterial } from '@babylonjs/core';
import { v4 } from 'uuid';
import { glsl } from '../../BabylonUtils';
import { commonVertexShaderWithWarning } from './Common';

export const fresnelVertexShader = commonVertexShaderWithWarning;
export const fresnelFragmentShader = glsl`
    uniform vec3 toColor;
    varying vec3 vPositionW;
    varying vec3 vNormalW;
    uniform vec3 cameraPosition;
    uniform float alpha;

    void main() {

        vec3 color = vec3(1., 1., 1.);

        vec3 viewDirectionW = normalize(cameraPosition - vPositionW);
        float fresnelTerm = dot(viewDirectionW, vNormalW);
        fresnelTerm = clamp(1. - fresnelTerm, 0., 1.0);

        gl_FragColor = vec4(mix(color, toColor, fresnelTerm), alpha);
    }
`;

export const makeFresnelMaterial = (materialOptions, scene) => {
    const _material = new ShaderMaterial(
        v4() + 'fresnel',
        scene,
        {
            vertex: 'fresnel',
            fragment: 'fresnel',
        },
        {
            attributes: ['position', 'normal', 'uv', 'world0', 'world1', 'world2', 'world3'],
            uniforms: ['worldView', 'worldViewProjection', 'view', 'projection', 'direction', 'cameraPosition'],
            needAlphaBlending: materialOptions.hasAlpha,
        }
    );
    
    const color = materialOptions.color || [1.0, 0.0, 0.0]
    _material.setColor3("toColor", new Color3(...color))
    _material.setFloat('alpha', materialOptions.alpha || (materialOptions.hasAlpha && 0.2) || 1);

    return _material;
};
