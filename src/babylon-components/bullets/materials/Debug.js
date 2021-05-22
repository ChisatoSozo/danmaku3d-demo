import { ShaderMaterial } from '@babylonjs/core';
import { v4 } from 'uuid';
import { glsl } from '../../BabylonUtils';
import { commonVertexShader } from './Common';

export const debugVertexShader = commonVertexShader;
export const debugFragmentShader = glsl`
    void main() {
        gl_FragColor = vec4(1., 1., 1., 1.);
    }
`;

export const makeDebugMaterial = (scene) => {
    const _material = new ShaderMaterial(
        v4() + 'debug',
        scene,
        {
            vertex: 'debug',
            fragment: 'debug',
        },
        {
            attributes: ['position', 'normal', 'uv', 'world0', 'world1', 'world2', 'world3'],
            uniforms: ['worldView', 'worldViewProjection', 'view', 'projection', 'direction', 'cameraPosition'],
        }
    );

    return _material;
};
