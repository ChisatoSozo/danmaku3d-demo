import { ShaderMaterial } from '@babylonjs/core';
import { v4 } from 'uuid';
import { glsl } from '../../BabylonUtils';
import { commonVertexShader } from './Common';

export const textureVertexShader = commonVertexShader;
export const textureFragmentShader = glsl`
    uniform sampler2D textureSampler;
    uniform float alpha;
    varying vec2 vUV;

    void main() {
        gl_FragColor = vec4(texture(textureSampler, vUV).xyz, alpha);
    }
`;

export const makeTextureMaterial = (materialOptions, assets, scene) => {
    const _material = new ShaderMaterial(
        v4() + 'texture',
        scene,
        {
            vertex: 'texture',
            fragment: 'texture',
        },
        {
            attributes: ['position', 'normal', 'uv', 'world0', 'world1', 'world2', 'world3'],
            uniforms: ['worldView', 'worldViewProjection', 'view', 'projection', 'direction', 'cameraPosition'],
            needAlphaBlending: materialOptions.hasAlpha,
        }
    );
    _material.setTexture('textureSampler', assets[materialOptions.texture]);
    _material.setFloat('alpha', materialOptions.alpha || (materialOptions.hasAlpha && 0.2) || 1);

    return _material;
};
