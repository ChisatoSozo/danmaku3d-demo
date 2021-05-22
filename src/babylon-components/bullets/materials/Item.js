import { ShaderMaterial } from '@babylonjs/core';
import { glsl } from '../../BabylonUtils';
import { makeName } from '../../hooks/useName';
import { commonItemVertexShader } from './Common';

export const itemVertexShader = commonItemVertexShader;
export const itemFragmentShader = glsl`
    uniform sampler2D textureSampler;
    varying vec2 vUV;

    void main() {
        gl_FragColor = texture(textureSampler, vUV);
    }
`;

export const makeItemMaterial = (materialOptions, assets, scene) => {
    const matName = makeName('itemMat');

    const _material = new ShaderMaterial(
        matName,
        scene,
        {
            vertex: 'item',
            fragment: 'item',
        },
        {
            attributes: ['position', 'normal', 'uv', 'world0', 'world1', 'world2', 'world3'],
            uniforms: ['worldView', 'worldViewProjection', 'view', 'projection', 'direction', 'cameraPosition'],
            needAlphaBlending: materialOptions.hasAlpha,
        }
    );

    _material.setTexture('textureSampler', assets[materialOptions.texture]);

    return _material;
};
