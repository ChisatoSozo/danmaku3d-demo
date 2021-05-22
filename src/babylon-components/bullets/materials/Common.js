import "@babylonjs/core/Shaders/ShadersInclude/instancesDeclaration";
import { BULLET_WARNING } from "../../../utils/Constants";
import { glsl } from "../../BabylonUtils";


export const commonVertexShader = glsl`
    #include<instancesDeclaration>
    attribute vec3 position;
    attribute vec3 normal;
    attribute vec2 uv;

    uniform mat4 view;
    uniform mat4 projection;
    uniform sampler2D positionSampler;
    uniform sampler2D velocitySampler;

    varying vec3 vPositionW;
    varying vec3 vNormalW;
    varying vec2 vUV;

    void makeRotation(in vec3 direction, out mat3 rotation)
    {
        vec3 xaxis = cross(vec3(0., 1., 0.), direction);
        xaxis = normalize(xaxis);

        vec3 yaxis = cross(direction, xaxis);
        yaxis = normalize(yaxis);

        rotation = mat3(xaxis, yaxis, direction);
    }

    void main() {
        vUV = uv;

        int instance = gl_InstanceID;
        int width = textureSize(positionSampler, 0).x;
        int x = instance % width;
        int y = instance / width;                            // integer division
        float u = (float(x) + 0.5) / float(width);           // map into 0-1 range
        float v = (float(y) + 0.5) / float(width);
        vec4 instPos = texture(positionSampler, vec2(u, v));
        vec4 instVel = texture(velocitySampler, vec2(u, v));

        mat3 rotation;
        makeRotation(normalize(vec3(instVel)), rotation);
        vec4 rotatedVert = vec4(rotation * position, 1.0 );

        vec4 totalPos = rotatedVert + instPos;
        totalPos.w = 1.;

        mat4 world = mat4(world0, world1, world2, world3);
        mat4 worldView = view * world;

        vec4 modelViewPosition = worldView * totalPos;
        gl_Position = projection * modelViewPosition;

        vPositionW = vec3( world * totalPos ) ;
        vNormalW = vec3(world * vec4(rotation * normal, 0.0));
    }
`;

export const commonVertexShaderWithWarning = glsl`
    #include<instancesDeclaration>
    attribute vec3 position;
    attribute vec3 normal;
    attribute vec2 uv;

    uniform mat4 view;
    uniform mat4 projection;
    uniform sampler2D positionSampler;
    uniform sampler2D velocitySampler;
    uniform sampler2D timingsSampler;
    uniform sampler2D endTimingsSampler;
    uniform float timeSinceStart;
    uniform float disableWarning;
    uniform float radius;

    varying vec3 vPositionW;
    varying vec3 vNormalW;
    varying vec2 vUV;
    varying float dTiming;

    void makeRotation(in vec3 direction, out mat3 rotation)
    {
        vec3 xaxis = cross(vec3(0., 1., 0.), direction);
        xaxis = normalize(xaxis);

        vec3 yaxis = cross(direction, xaxis);
        yaxis = normalize(yaxis);

        rotation = mat3(xaxis, yaxis, direction);
    }

    void main() {
        vUV = uv;

        int instance = gl_InstanceID;
        int width = textureSize(positionSampler, 0).x;
        int x = instance % width;
        int y = instance / width;                            // integer division
        float u = (float(x) + 0.5) / float(width);           // map into 0-1 range
        float v = (float(y) + 0.5) / float(width);
        vec4 instPos = texture(positionSampler, vec2(u, v));
        vec4 instVel = texture(velocitySampler, vec2(u, v));
        vec4 timingPosition = texture2D( timingsSampler, vec2(u, v));
        vec4 endTimingPosition = texture2D( endTimingsSampler, vec2(u, v) );
        float timing = timingPosition.w;

        mat3 rotation;
        makeRotation(normalize(vec3(instVel)), rotation);
        vec4 rotatedVert = vec4(rotation * position, 1.0 );

        dTiming = timeSinceStart - timing;

        float size = (${BULLET_WARNING} - clamp(dTiming, 0.0, ${BULLET_WARNING})) / ${BULLET_WARNING};
        size *= (1. - disableWarning);
        float hasEnded = float(dTiming > endTimingPosition.w);

        rotatedVert *= size * 3. + 1.;
        rotatedVert *= (1. - hasEnded);
        rotatedVert *= radius;

        vec4 totalPos = rotatedVert + instPos;
        totalPos.w = 1.;

        mat4 world = mat4(world0, world1, world2, world3);
        mat4 worldView = view * world;

        vec4 modelViewPosition = worldView * totalPos;
        gl_Position = projection * modelViewPosition;

        vPositionW = vec3( world * totalPos ) ;
        vNormalW = vec3(world * vec4(rotation * normal, 0.0));
    }
`;

export const commonItemVertexShader = glsl`
    #include<instancesDeclaration>
    attribute vec3 position;
    attribute vec3 normal;
    attribute vec2 uv;

    uniform mat4 view;
    uniform mat4 projection;
    uniform sampler2D positionSampler;
    uniform sampler2D velocitySampler;
    uniform vec3 cameraPosition;

    varying vec3 vPositionW;
    varying vec3 vNormalW;
    varying vec2 vUV;

    void makeRotation(in vec3 direction, out mat3 rotation)
    {
        vec3 xaxis = cross(vec3(0., 1., 0.), direction);
        xaxis = normalize(xaxis);

        vec3 yaxis = cross(direction, xaxis);
        yaxis = normalize(yaxis);

        rotation = mat3(xaxis, yaxis, direction);
    }

    void main() {
        vUV = uv;

        int instance = gl_InstanceID;
        int width = textureSize(positionSampler, 0).x;
        int x = instance % width;
        int y = instance / width;                            // integer division
        float u = (float(x) + 0.5) / float(width);           // map into 0-1 range
        float v = (float(y) + 0.5) / float(width);
        vec4 instPos = texture(positionSampler, vec2(u, v));
        vec4 instVel = texture(velocitySampler, vec2(u, v));

        mat3 rotation;
        vec3 cameraVec = vec3(instPos) - cameraPosition;
        makeRotation(normalize(cameraVec), rotation);
        vec4 rotatedVert = vec4(rotation * position, 1.0 );

        vec4 totalPos = rotatedVert + instPos;
        totalPos.w = 1.;

        mat4 world = mat4(world0, world1, world2, world3);
        mat4 worldView = view * world;

        vec4 modelViewPosition = worldView * totalPos;
        gl_Position = projection * modelViewPosition;

        vPositionW = vec3( world * totalPos ) ;
        vNormalW = vec3(world * vec4(rotation * normal, 0.0));
    }
`;
