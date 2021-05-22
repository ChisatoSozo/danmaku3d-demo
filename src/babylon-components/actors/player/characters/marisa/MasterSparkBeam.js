import { Effect, ShaderMaterial, Vector3 } from '@babylonjs/core';
import React, { useEffect, useMemo } from 'react';
import { useBeforeRender, useScene } from 'react-babylonjs';
import { glsl } from '../../../../BabylonUtils';
import { useGlowLayer } from '../../../../gameLogic/useGlowLayer';
import { useAssets } from '../../../../hooks/useAssets';

Effect.ShadersStore['beamVertexShader'] = glsl`
    attribute vec3 position;
    attribute vec3 normal;
    attribute vec2 uv;
    uniform mat4 world;
    uniform mat4 worldViewProjection;
    varying vec3 vPositionW;
    varying vec3 vPosition;
    varying vec3 vNormalW;
    varying vec2 vUV;

    #include<helperFunctions>

    void main() {
        vPosition = position;
        vPositionW = (world * vec4(position, 1.0)).xyz;

        mat3 normalMatrix = transposeMat3(inverseMat3(mat3(world)));
        vNormalW = normalMatrix * normal;
        gl_Position = worldViewProjection * vec4(position, 1.0);
        vUV = uv;
    }
`;

Effect.ShadersStore['beamFragmentShader'] = glsl`
    varying vec3 vPositionW;
    varying vec3 vPosition;
    varying vec3 vNormalW;
    uniform vec3 cameraPosition;
    uniform float hOffset;

    vec3 hsl2rgb( in vec3 c )
    {
        vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );

        return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
    }

    void main() {
        vec3 viewDirectionW = normalize(cameraPosition - vPositionW);
        float fresnelTerm = dot(viewDirectionW, vNormalW);
        fresnelTerm = clamp(1. - fresnelTerm, 0., 1.0);

        fresnelTerm = pow(fresnelTerm, 2.);

        vec4 from = vec4(1., 1., 1., 1.);

        float h = atan(vPosition.y, vPosition.x)/(2.*3.14159);
        h = mod((h + hOffset), 1.);
        vec3 hsl = vec3(h, 1., .5);
        vec3 rgb = hsl2rgb(hsl);
        vec4 to = vec4(rgb, 0.);

        vec4 color = mix(from, to, fresnelTerm);


        gl_FragColor = color;
    }
`;

export const MasterSparkBeam = React.forwardRef((props, ref) => {
    const beam = useAssets("beam");
    const beamMesh = useMemo(() => beam?._children?.[0], [beam])
    const glowLayer = useGlowLayer();
    const scene = useScene()

    useEffect(() => {
        if (!beam) return;
        const material = new ShaderMaterial(
            'beamMaterial',
            scene,
            {
                vertex: 'beam',
                fragment: 'beam',
            },
            {
                attributes: ['position', 'normal', 'uv', 'world0', 'world1', 'world2', 'world3'],
                uniforms: ['worldView', 'worldViewProjection', 'view', 'projection', 'direction', 'cameraPosition', 'world'],
                needAlphaBlending: true
            }
        );
        beamMesh.rotation = new Vector3(0, Math.PI, 0);
        beamMesh.material = material;
        beamMesh.material.hOffset = 0
        beamMesh.material.setFloat("hOffset", beamMesh.material.hOffset);
        glowLayer.referenceMeshToUseItsOwnMaterial(beamMesh);
        beam.parent = ref.current;
    }, [beam, beamMesh, glowLayer, ref, scene])

    useBeforeRender(() => {
        if (!beamMesh) return;
        beamMesh.material.hOffset += 6.263895263;
        beamMesh.material.setFloat("hOffset", beamMesh.material.hOffset);

    })

    return (
        <transformNode name="masterSparkBeam" ref={ref} {...props} />
    )
})
