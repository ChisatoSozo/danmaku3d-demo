import { __extends } from 'tslib';
import { Vector3, Vector2 } from '@babylonjs/core/Maths/math.vector';
import { Color4, Color3 } from '@babylonjs/core/Maths/math.color';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { ProceduralTexture } from '@babylonjs/core/Materials/Textures/Procedurals/proceduralTexture';
/**
 * Procedural texturing is a way to programmatically create a texture. There are 2 types of procedural textures: code-only, and code that references some classic 2D images, sometimes called 'refMaps' or 'sampler' images.
 * Custom Procedural textures are the easiest way to create your own procedural in your application.
 * @see https://doc.babylonjs.com/how_to/how_to_use_procedural_textures#creating-custom-procedural-textures
 */

const readLatency = 16;

export const allSyncs = {
    syncs: [],
};

const _readTexturePixels = function (engine, texture, width, height, faceIndex, level, buffer, isPlayerBullet) {
    if (faceIndex === void 0) {
        faceIndex = -1;
    }
    if (level === void 0) {
        level = 0;
    }
    if (buffer === void 0) {
        buffer = null;
    }

    const numPPB = readLatency;

    var gl = engine._gl;
    if (!gl) {
        throw new Error('Engine does not have gl rendering context.');
    }
    if (!engine._dummyFramebuffer) {
        var dummy = gl.createFramebuffer();
        if (!dummy) {
            throw new Error('Unable to create dummy framebuffer');
        }
        engine._dummyFramebuffer = dummy;
    }
    if (!texture._PPBWheel) {
        texture._PPBWheel = [];
        for (let i = 0; i < numPPB; i++) {
            const newPPB = gl.createBuffer();
            if (!newPPB) {
                throw new Error('Unable to create PPB');
            }
            texture._PPBWheel.push(newPPB);
        }

        texture._activePPB = texture._PPBWheel[0];
        texture._activePPBIndex = 0;
    }

    //swap PIXEL_PACK_BUFFER
    texture._activePPBIndex = (texture._activePPBIndex + 1) % texture._PPBWheel.length;
    texture._activePPB = texture._PPBWheel[texture._activePPBIndex];

    gl.bindFramebuffer(gl.FRAMEBUFFER, engine._dummyFramebuffer);
    if (faceIndex > -1) {
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,
            gl.COLOR_ATTACHMENT0,
            gl.TEXTURE_CUBE_MAP_POSITIVE_X + faceIndex,
            texture._webGLTexture,
            level
        );
    } else {
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture._webGLTexture, level);
    }
    var readType = texture.type !== undefined ? engine._getWebGLTextureType(texture.type) : gl.UNSIGNED_BYTE;
    switch (readType) {
        case gl.UNSIGNED_BYTE:
            if (!buffer) {
                buffer = new Uint8Array(4 * width * height);
            }
            readType = gl.UNSIGNED_BYTE;
            break;
        default:
            if (!buffer) {
                buffer = new Float32Array(4 * width * height);
            }
            readType = gl.FLOAT;
            break;
    }

    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, texture._activePPB);
    gl.bufferData(gl.PIXEL_PACK_BUFFER, buffer.byteLength, gl.STREAM_READ);
    gl.readPixels(0, 0, width, height, gl.RGBA, readType, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, engine._currentFramebuffer);

    var sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    if (!sync) {
        return null;
    }
    gl.flush();

    let promiseResolve;
    let promiseReject;

    const returnPromise = new Promise(function (resolve, reject) {
        promiseResolve = resolve;
        promiseReject = reject;
    });

    allSyncs.syncs.push({
        sync,
        promiseResolve,
        promiseReject,
        buffer,
        PPB: texture._activePPB,
    });

    return returnPromise;
};

var CustomCustomProceduralTexture = /** @class */ (function (_super) {
    __extends(CustomCustomProceduralTexture, _super);
    /**
     * Instantiates a new Custom Procedural Texture.
     * Procedural texturing is a way to programmatically create a texture. There are 2 types of procedural textures: code-only, and code that references some classic 2D images, sometimes called 'refMaps' or 'sampler' images.
     * Custom Procedural textures are the easiest way to create your own procedural in your application.
     * @see https://doc.babylonjs.com/how_to/how_to_use_procedural_textures#creating-custom-procedural-textures
     * @param name Define the name of the texture
     * @param texturePath Define the folder path containing all the cutom texture related files (config, shaders...)
     * @param size Define the size of the texture to create
     * @param scene Define the scene the texture belongs to
     * @param fallbackTexture Define a fallback texture in case there were issues to create the custom texture
     * @param generateMipMaps Define if the texture should creates mip maps or not
     */
    function CustomCustomProceduralTexture(name, texturePath, size, scene, fallbackTexture, generateMipMaps, isCube, type) {
        var _this = _super.call(this, name, size, null, scene, fallbackTexture, generateMipMaps, isCube, type) || this;
        _this._animate = true;
        _this._time = 0;
        _this._texturePath = texturePath;
        //Try to load json
        _this.setFragment(_this._texturePath);
        _this.refreshRate = 1;
        return _this;
    }
    /**
     * Is the texture ready to be used ? (rendered at least once)
     * @returns true if ready, otherwise, false.
     */
    CustomCustomProceduralTexture.prototype.isReady = function () {
        if (this.sleep) return false;
        if (!_super.prototype.isReady.call(this)) {
            return false;
        }
        for (var name in this._textures) {
            var texture = this._textures[name];
            if (!texture.isReady()) {
                return false;
            }
        }
        return true;
    };
    /**
     * Render the texture to its associated render target.
     * @param useCameraPostProcess Define if camera post process should be applied to the texture
     */
    CustomCustomProceduralTexture.prototype.render = function (useCameraPostProcess) {
        if (this.sleep) return;

        var scene = this.getScene();
        if (this._animate && scene) {
            this._time += scene.getAnimationRatio() * 0.03;
            this.updateShaderUniforms();
        }
        _super.prototype.render.call(this, useCameraPostProcess);
    };

    CustomCustomProceduralTexture.prototype.dispose = function () {
        if (this._PPBWheel) {
            const engine = this._getEngine();
            const gl = engine._gl;
            for (let buf of this._PPBWheel) {
                gl.deleteBuffer(buf);
            }
        }
        _super.prototype.dispose.call(this);
    };
    /**
     * Update the list of dependant textures samplers in the shader.
     */
    CustomCustomProceduralTexture.prototype.updateTextures = function () {
        for (var i = 0; i < this._config.sampler2Ds.length; i++) {
            this.setTexture(
                this._config.sampler2Ds[i].sample2Dname,
                new Texture(this._texturePath + '/' + this._config.sampler2Ds[i].textureRelativeUrl, this.getScene())
            );
        }
    };
    /**
     * Update the uniform values of the procedural texture in the shader.
     */
    CustomCustomProceduralTexture.prototype.updateShaderUniforms = function () {
        if (this._config) {
            for (var j = 0; j < this._config.uniforms.length; j++) {
                var uniform = this._config.uniforms[j];
                switch (uniform.type) {
                    case 'float':
                        this.setFloat(uniform.name, uniform.value);
                        break;
                    case 'color3':
                        this.setColor3(uniform.name, new Color3(uniform.r, uniform.g, uniform.b));
                        break;
                    case 'color4':
                        this.setColor4(uniform.name, new Color4(uniform.r, uniform.g, uniform.b, uniform.a));
                        break;
                    case 'vector2':
                        this.setVector2(uniform.name, new Vector2(uniform.x, uniform.y));
                        break;
                    case 'vector3':
                        this.setVector3(uniform.name, new Vector3(uniform.x, uniform.y, uniform.z));
                        break;
                    default:
                        throw new Error('Unsupported uniform type: ' + uniform.type);
                }
            }
        }
        this.setFloat('time', this._time);
    };
    CustomCustomProceduralTexture.prototype.readPixels = function (faceIndex, level, buffer) {
        if (faceIndex === void 0) {
            faceIndex = 0;
        }
        if (level === void 0) {
            level = 0;
        }
        if (buffer === void 0) {
            buffer = null;
        }
        if (!this._texture) {
            return null;
        }
        var size = this.getSize();
        var width = size.width;
        var height = size.height;
        var engine = this._getEngine();
        if (!engine) {
            return null;
        }
        if (level !== 0) {
            width = width / Math.pow(2, level);
            height = height / Math.pow(2, level);
            width = Math.round(width);
            height = Math.round(height);
        }
        try {
            if (this._texture.isCube) {
                return _readTexturePixels(engine, this._texture, width, height, faceIndex, level, buffer);
            }
            return _readTexturePixels(engine, this._texture, width, height, -1, level, buffer);
        } catch (e) {
            console.warn(e);
            return null;
        }
    };
    Object.defineProperty(CustomCustomProceduralTexture.prototype, 'animate', {
        /**
         * Define if the texture animates or not.
         */
        get: function () {
            return this._animate;
        },
        set: function (value) {
            this._animate = value;
        },
        enumerable: false,
        configurable: true,
    });
    return CustomCustomProceduralTexture;
})(ProceduralTexture);
export { CustomCustomProceduralTexture };
//# sourceMappingURL=CustomcustomProceduralTexture.js.map
