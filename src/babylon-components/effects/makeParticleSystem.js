import {
    BoxParticleEmitter, Color3, Color4, ConeParticleEmitter,


    CylinderDirectedParticleEmitter, CylinderParticleEmitter, HemisphericParticleEmitter,





    MeshParticleEmitter, ParticleSystem, PointParticleEmitter, SphereDirectedParticleEmitter, SphereParticleEmitter, ThinEngine, Vector3, _TypeStore
} from '@babylonjs/core';
import { makeName } from '../hooks/useName';

const safeParticleParse = function (parsedParticleSystem, particleSystem, sceneOrEngine, rootUrl, sharedTexture) {
    var scene;
    if (sceneOrEngine instanceof ThinEngine) {
        scene = null;
    } else {
        scene = sceneOrEngine;
    }
    particleSystem.particleTexture = sharedTexture;
    // Emitter
    if (!parsedParticleSystem.emitterId && parsedParticleSystem.emitterId !== 0 && parsedParticleSystem.emitter === undefined) {
        particleSystem.emitter = Vector3.Zero();
    } else if (parsedParticleSystem.emitterId && scene) {
        particleSystem.emitter = scene.getLastMeshByID(parsedParticleSystem.emitterId);
    } else {
        particleSystem.emitter = Vector3.FromArray(parsedParticleSystem.emitter);
    }
    particleSystem.isLocal = !!parsedParticleSystem.isLocal;
    // Misc.
    if (parsedParticleSystem.renderingGroupId !== undefined) {
        particleSystem.renderingGroupId = parsedParticleSystem.renderingGroupId;
    }
    if (parsedParticleSystem.isBillboardBased !== undefined) {
        particleSystem.isBillboardBased = parsedParticleSystem.isBillboardBased;
    }
    if (parsedParticleSystem.billboardMode !== undefined) {
        particleSystem.billboardMode = parsedParticleSystem.billboardMode;
    }
    // Animations
    if (parsedParticleSystem.animations) {
        for (var animationIndex = 0; animationIndex < parsedParticleSystem.animations.length; animationIndex++) {
            var parsedAnimation = parsedParticleSystem.animations[animationIndex];
            var internalClass_1 = _TypeStore.GetClass('BABYLON.Animation');
            if (internalClass_1) {
                particleSystem.animations.push(internalClass_1.Parse(parsedAnimation));
            }
        }
        particleSystem.beginAnimationOnStart = parsedParticleSystem.beginAnimationOnStart;
        particleSystem.beginAnimationFrom = parsedParticleSystem.beginAnimationFrom;
        particleSystem.beginAnimationTo = parsedParticleSystem.beginAnimationTo;
        particleSystem.beginAnimationLoop = parsedParticleSystem.beginAnimationLoop;
    }
    if (parsedParticleSystem.autoAnimate && scene) {
        scene.beginAnimation(
            particleSystem,
            parsedParticleSystem.autoAnimateFrom,
            parsedParticleSystem.autoAnimateTo,
            parsedParticleSystem.autoAnimateLoop,
            parsedParticleSystem.autoAnimateSpeed || 1.0
        );
    }
    // Particle system
    particleSystem.startDelay = parsedParticleSystem.startDelay | 0;
    particleSystem.minAngularSpeed = parsedParticleSystem.minAngularSpeed;
    particleSystem.maxAngularSpeed = parsedParticleSystem.maxAngularSpeed;
    particleSystem.minSize = parsedParticleSystem.minSize;
    particleSystem.maxSize = parsedParticleSystem.maxSize;
    if (parsedParticleSystem.minScaleX) {
        particleSystem.minScaleX = parsedParticleSystem.minScaleX;
        particleSystem.maxScaleX = parsedParticleSystem.maxScaleX;
        particleSystem.minScaleY = parsedParticleSystem.minScaleY;
        particleSystem.maxScaleY = parsedParticleSystem.maxScaleY;
    }
    if (parsedParticleSystem.preWarmCycles !== undefined) {
        particleSystem.preWarmCycles = parsedParticleSystem.preWarmCycles;
        particleSystem.preWarmStepOffset = parsedParticleSystem.preWarmStepOffset;
    }
    if (parsedParticleSystem.minInitialRotation !== undefined) {
        particleSystem.minInitialRotation = parsedParticleSystem.minInitialRotation;
        particleSystem.maxInitialRotation = parsedParticleSystem.maxInitialRotation;
    }
    particleSystem.minLifeTime = parsedParticleSystem.minLifeTime;
    particleSystem.maxLifeTime = parsedParticleSystem.maxLifeTime;
    particleSystem.minEmitPower = parsedParticleSystem.minEmitPower;
    particleSystem.maxEmitPower = parsedParticleSystem.maxEmitPower;
    particleSystem.emitRate = parsedParticleSystem.emitRate;
    particleSystem.gravity = Vector3.FromArray(parsedParticleSystem.gravity);
    if (parsedParticleSystem.noiseStrength) {
        particleSystem.noiseStrength = Vector3.FromArray(parsedParticleSystem.noiseStrength);
    }
    particleSystem.color1 = Color4.FromArray(parsedParticleSystem.color1);
    particleSystem.color2 = Color4.FromArray(parsedParticleSystem.color2);
    particleSystem.colorDead = Color4.FromArray(parsedParticleSystem.colorDead);
    particleSystem.updateSpeed = parsedParticleSystem.updateSpeed;
    particleSystem.targetStopDuration = parsedParticleSystem.targetStopDuration;
    particleSystem.blendMode = parsedParticleSystem.blendMode;
    if (parsedParticleSystem.colorGradients) {
        for (var _i = 0, _a = parsedParticleSystem.colorGradients; _i < _a.length; _i++) {
            var colorGradient = _a[_i];
            particleSystem.addColorGradient(
                colorGradient.gradient,
                Color4.FromArray(colorGradient.color1),
                colorGradient.color2 ? Color4.FromArray(colorGradient.color2) : undefined
            );
        }
    }
    if (parsedParticleSystem.rampGradients) {
        for (var _b = 0, _c = parsedParticleSystem.rampGradients; _b < _c.length; _b++) {
            var rampGradient = _c[_b];
            particleSystem.addRampGradient(rampGradient.gradient, Color3.FromArray(rampGradient.color));
        }
        particleSystem.useRampGradients = parsedParticleSystem.useRampGradients;
    }
    if (parsedParticleSystem.colorRemapGradients) {
        for (var _d = 0, _e = parsedParticleSystem.colorRemapGradients; _d < _e.length; _d++) {
            var colorRemapGradient = _e[_d];
            particleSystem.addColorRemapGradient(
                colorRemapGradient.gradient,
                colorRemapGradient.factor1 !== undefined ? colorRemapGradient.factor1 : colorRemapGradient.factor,
                colorRemapGradient.factor2
            );
        }
    }
    if (parsedParticleSystem.alphaRemapGradients) {
        for (var _f = 0, _g = parsedParticleSystem.alphaRemapGradients; _f < _g.length; _f++) {
            var alphaRemapGradient = _g[_f];
            particleSystem.addAlphaRemapGradient(
                alphaRemapGradient.gradient,
                alphaRemapGradient.factor1 !== undefined ? alphaRemapGradient.factor1 : alphaRemapGradient.factor,
                alphaRemapGradient.factor2
            );
        }
    }
    if (parsedParticleSystem.sizeGradients) {
        for (var _h = 0, _j = parsedParticleSystem.sizeGradients; _h < _j.length; _h++) {
            var sizeGradient = _j[_h];
            particleSystem.addSizeGradient(
                sizeGradient.gradient,
                sizeGradient.factor1 !== undefined ? sizeGradient.factor1 : sizeGradient.factor,
                sizeGradient.factor2
            );
        }
    }
    if (parsedParticleSystem.angularSpeedGradients) {
        for (var _k = 0, _l = parsedParticleSystem.angularSpeedGradients; _k < _l.length; _k++) {
            var angularSpeedGradient = _l[_k];
            particleSystem.addAngularSpeedGradient(
                angularSpeedGradient.gradient,
                angularSpeedGradient.factor1 !== undefined ? angularSpeedGradient.factor1 : angularSpeedGradient.factor,
                angularSpeedGradient.factor2
            );
        }
    }
    if (parsedParticleSystem.velocityGradients) {
        for (var _m = 0, _o = parsedParticleSystem.velocityGradients; _m < _o.length; _m++) {
            var velocityGradient = _o[_m];
            particleSystem.addVelocityGradient(
                velocityGradient.gradient,
                velocityGradient.factor1 !== undefined ? velocityGradient.factor1 : velocityGradient.factor,
                velocityGradient.factor2
            );
        }
    }
    if (parsedParticleSystem.dragGradients) {
        for (var _p = 0, _q = parsedParticleSystem.dragGradients; _p < _q.length; _p++) {
            var dragGradient = _q[_p];
            particleSystem.addDragGradient(
                dragGradient.gradient,
                dragGradient.factor1 !== undefined ? dragGradient.factor1 : dragGradient.factor,
                dragGradient.factor2
            );
        }
    }
    if (parsedParticleSystem.emitRateGradients) {
        for (var _r = 0, _s = parsedParticleSystem.emitRateGradients; _r < _s.length; _r++) {
            var emitRateGradient = _s[_r];
            particleSystem.addEmitRateGradient(
                emitRateGradient.gradient,
                emitRateGradient.factor1 !== undefined ? emitRateGradient.factor1 : emitRateGradient.factor,
                emitRateGradient.factor2
            );
        }
    }
    if (parsedParticleSystem.startSizeGradients) {
        for (var _t = 0, _u = parsedParticleSystem.startSizeGradients; _t < _u.length; _t++) {
            var startSizeGradient = _u[_t];
            particleSystem.addStartSizeGradient(
                startSizeGradient.gradient,
                startSizeGradient.factor1 !== undefined ? startSizeGradient.factor1 : startSizeGradient.factor,
                startSizeGradient.factor2
            );
        }
    }
    if (parsedParticleSystem.lifeTimeGradients) {
        for (var _v = 0, _w = parsedParticleSystem.lifeTimeGradients; _v < _w.length; _v++) {
            var lifeTimeGradient = _w[_v];
            particleSystem.addLifeTimeGradient(
                lifeTimeGradient.gradient,
                lifeTimeGradient.factor1 !== undefined ? lifeTimeGradient.factor1 : lifeTimeGradient.factor,
                lifeTimeGradient.factor2
            );
        }
    }
    if (parsedParticleSystem.limitVelocityGradients) {
        for (var _x = 0, _y = parsedParticleSystem.limitVelocityGradients; _x < _y.length; _x++) {
            var limitVelocityGradient = _y[_x];
            particleSystem.addLimitVelocityGradient(
                limitVelocityGradient.gradient,
                limitVelocityGradient.factor1 !== undefined ? limitVelocityGradient.factor1 : limitVelocityGradient.factor,
                limitVelocityGradient.factor2
            );
        }
        particleSystem.limitVelocityDamping = parsedParticleSystem.limitVelocityDamping;
    }
    if (parsedParticleSystem.noiseTexture && scene) {
        var internalClass_2 = _TypeStore.GetClass('BABYLON.ProceduralTexture');
        particleSystem.noiseTexture = internalClass_2.Parse(parsedParticleSystem.noiseTexture, scene, rootUrl);
    }
    // Emitter
    var emitterType;
    if (parsedParticleSystem.particleEmitterType) {
        switch (parsedParticleSystem.particleEmitterType.type) {
            case 'SphereParticleEmitter':
                emitterType = new SphereParticleEmitter();
                break;
            case 'SphereDirectedParticleEmitter':
                emitterType = new SphereDirectedParticleEmitter();
                break;
            case 'ConeEmitter':
            case 'ConeParticleEmitter':
                emitterType = new ConeParticleEmitter();
                break;
            case 'CylinderParticleEmitter':
                emitterType = new CylinderParticleEmitter();
                break;
            case 'CylinderDirectedParticleEmitter':
                emitterType = new CylinderDirectedParticleEmitter();
                break;
            case 'HemisphericParticleEmitter':
                emitterType = new HemisphericParticleEmitter();
                break;
            case 'PointParticleEmitter':
                emitterType = new PointParticleEmitter();
                break;
            case 'MeshParticleEmitter':
                emitterType = new MeshParticleEmitter();
                break;
            case 'BoxEmitter':
            case 'BoxParticleEmitter':
            default:
                emitterType = new BoxParticleEmitter();
                break;
        }
        emitterType.parse(parsedParticleSystem.particleEmitterType, scene);
    } else {
        emitterType = new BoxParticleEmitter();
        emitterType.parse(parsedParticleSystem, scene);
    }
    particleSystem.particleEmitterType = emitterType;
    // Animation sheet
    particleSystem.startSpriteCellID = parsedParticleSystem.startSpriteCellID;
    particleSystem.endSpriteCellID = parsedParticleSystem.endSpriteCellID;
    particleSystem.spriteCellWidth = parsedParticleSystem.spriteCellWidth;
    particleSystem.spriteCellHeight = parsedParticleSystem.spriteCellHeight;
    particleSystem.spriteCellChangeSpeed = parsedParticleSystem.spriteCellChangeSpeed;
    particleSystem.spriteRandomStartCell = parsedParticleSystem.spriteRandomStartCell;
};

const safeParse = function (parsedParticleSystem, sceneOrEngine, rootUrl, doNotStart, sharedTexture) {
    if (doNotStart === void 0) {
        doNotStart = false;
    }
    var name = parsedParticleSystem.name;
    var particleSystem = new ParticleSystem(
        name,
        {
            capacity: parsedParticleSystem.capacity,
            randomTextureSize: parsedParticleSystem.randomTextureSize,
        },
        sceneOrEngine
    );
    if (parsedParticleSystem.activeParticleCount) {
        particleSystem.activeParticleCount = parsedParticleSystem.activeParticleCount;
    }
    safeParticleParse(parsedParticleSystem, particleSystem, sceneOrEngine, rootUrl, sharedTexture);
    // Auto start
    if (parsedParticleSystem.preventAutoStart) {
        particleSystem.preventAutoStart = parsedParticleSystem.preventAutoStart;
    }
    if (!doNotStart && !particleSystem.preventAutoStart) {
        particleSystem.start();
    }
    return particleSystem;
};

const safeClone = function (system, name, newEmitter) {
    var serialization = system.serialize();
    var result = safeParse(serialization, system._scene || system._engine, '', true, system.particleTexture);
    var custom = Object.assign({}, system._customEffect);
    result.name = name;
    result._customEffect = custom;
    if (newEmitter === undefined) {
        newEmitter = system.emitter;
    }
    result.emitter = newEmitter;
    result.noiseTexture = system.noiseTexture;
    return result;
};

export const makeParticleSystem = (assets, particleSystemName, emitter) => {
    const particleSystem = assets[particleSystemName];
    if (!particleSystem) throw new Error("Couldn't find particle system " + particleSystemName)
    particleSystem.emitter = emitter;

    return particleSystem;
};

export const makeParticleSystemFromSingle = (assets, particleSystemName, emitter) => {
    const name = makeName(particleSystemName);
    const particleSystem = assets[particleSystemName];
    const clonedSystem = safeClone(particleSystem, name);
    particleSystem.emitter = emitter;

    return clonedSystem;
};
