import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { VertexBuffer } from "@babylonjs/core/Meshes/buffer";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { VertexData } from "@babylonjs/core/Meshes/mesh.vertexData";
import { __extends } from "tslib";
import { nullVector } from "../utils/Constants";
/**
 * Class used to create a trail following a mesh
 */
var TrailMesh = /** @class */ (function (_super) {
    __extends(TrailMesh, _super);
    /**
     * @constructor
     * @param name The value used by scene.getMeshByName() to do a lookup.
     * @param generator The mesh or transform node to generate a trail.
     * @param scene The scene to add this mesh to.
     * @param diameter Diameter of trailing mesh. Default is 1.
     * @param length Length of trailing mesh. Default is 60.
     * @param autoStart Automatically start trailing mesh. Default true.
     */
    function TrailMesh(name, generator, scene, diameter, length, autoStart) {
        if (diameter === void 0) { diameter = 1; }
        if (length === void 0) { length = 60; }
        if (autoStart === void 0) { autoStart = true; }
        var _this = _super.call(this, name, scene) || this;
        _this._sectionPolygonPointsCount = 4;
        _this._running = false;
        _this._autoStart = autoStart;
        _this._generator = generator;
        _this._diameter = diameter;
        _this._length = length;
        _this._sectionVectors = [];
        _this._sectionNormalVectors = [];
        for (let i = 0; i < _this._sectionPolygonPointsCount; i++) {
            _this._sectionVectors[i] = Vector3.Zero();
            _this._sectionNormalVectors[i] = Vector3.Zero();
        }
        _this._createMesh();
        return _this;
    }
    /**
     * "TrailMesh"
     * @returns "TrailMesh"
     */
    TrailMesh.prototype.getClassName = function () {
        return "TrailMesh";
    };

    TrailMesh.prototype._recomputeMesh = function (sourceOverride) {
        var data = new VertexData();
        var positions = [];
        var normals = [];
        let indices = [];

        var meshCenter = sourceOverride || this._generator.getAbsolutePosition();
        var alpha = 2 * Math.PI / this._sectionPolygonPointsCount;
        for (let i = 0; i < this._sectionPolygonPointsCount; i++) {
            positions.push(meshCenter.x + Math.cos(i * alpha) * this._diameter, meshCenter.y + Math.sin(i * alpha) * this._diameter, meshCenter.z);
        }
        for (let i = 1; i <= this._length; i++) {
            for (let j = 0; j < this._sectionPolygonPointsCount; j++) {
                positions.push(meshCenter.x + Math.cos(j * alpha) * this._diameter, meshCenter.y + Math.sin(j * alpha) * this._diameter, meshCenter.z);
            }
            var l = positions.length / 3 - 2 * this._sectionPolygonPointsCount;
            for (let j = 0; j < this._sectionPolygonPointsCount - 1; j++) {
                indices.push(l + j, l + j + this._sectionPolygonPointsCount, l + j + this._sectionPolygonPointsCount + 1);
                indices.push(l + j, l + j + this._sectionPolygonPointsCount + 1, l + j + 1);
            }
            indices.push(l + this._sectionPolygonPointsCount - 1, l + this._sectionPolygonPointsCount - 1 + this._sectionPolygonPointsCount, l + this._sectionPolygonPointsCount);
            indices.push(l + this._sectionPolygonPointsCount - 1, l + this._sectionPolygonPointsCount, l);
        }
        VertexData.ComputeNormals(positions, indices, normals);
        data.positions = positions;
        data.normals = normals;
        data.indices = indices;
        data.applyToMesh(this, true);
    }

    TrailMesh.prototype._createMesh = function () {
        this._recomputeMesh();
        if (this._autoStart) {
            this.start();
        }
    };
    /**
     * Start trailing mesh.
     */
    TrailMesh.prototype.start = function (recomputeMesh) {
        if (recomputeMesh) this._recomputeMesh();
        var _this = this;
        if (!this._running) {
            this._running = true;
            this._beforeRenderObserver = this.getScene().onBeforeRenderObservable.add(function () {
                _this.update();
            });
        }
    };
    /**
     * Stop trailing mesh.
     */
    TrailMesh.prototype.stop = function (recomputeMesh) {
        if (recomputeMesh) this._recomputeMesh(nullVector);
        if (this._beforeRenderObserver && this._running) {
            this._running = false;
            this.getScene().onBeforeRenderObservable.remove(this._beforeRenderObserver);
        }
    };
    /**
     * Update trailing mesh geometry.
     */
    TrailMesh.prototype.update = function () {
        var positions = this.getVerticesData(VertexBuffer.PositionKind);
        var normals = this.getVerticesData(VertexBuffer.NormalKind);
        var wm = this._generator.getWorldMatrix();
        if (wm.getTranslation().equals(Vector3.Zero())) return;
        if (wm.getTranslation().equals(nullVector)) return;
        if (positions && normals) {
            for (let i = 3 * this._sectionPolygonPointsCount; i < positions.length; i++) {
                positions[i - 3 * this._sectionPolygonPointsCount] = positions[i] - normals[i] / this._length * this._diameter;
            }
            for (let i = 3 * this._sectionPolygonPointsCount; i < normals.length; i++) {
                normals[i - 3 * this._sectionPolygonPointsCount] = normals[i];
            }
            var l = positions.length - 3 * this._sectionPolygonPointsCount;
            var alpha = 2 * Math.PI / this._sectionPolygonPointsCount;
            for (let i = 0; i < this._sectionPolygonPointsCount; i++) {
                this._sectionVectors[i].copyFromFloats(Math.cos(i * alpha) * this._diameter, Math.sin(i * alpha) * this._diameter, 0);
                this._sectionNormalVectors[i].copyFromFloats(Math.cos(i * alpha), Math.sin(i * alpha), 0);
                Vector3.TransformCoordinatesToRef(this._sectionVectors[i], wm, this._sectionVectors[i]);
                Vector3.TransformNormalToRef(this._sectionNormalVectors[i], wm, this._sectionNormalVectors[i]);
            }
            for (let i = 0; i < this._sectionPolygonPointsCount; i++) {
                positions[l + 3 * i] = this._sectionVectors[i].x;
                positions[l + 3 * i + 1] = this._sectionVectors[i].y;
                positions[l + 3 * i + 2] = this._sectionVectors[i].z;
                normals[l + 3 * i] = this._sectionNormalVectors[i].x;
                normals[l + 3 * i + 1] = this._sectionNormalVectors[i].y;
                normals[l + 3 * i + 2] = this._sectionNormalVectors[i].z;
            }
            this.updateVerticesData(VertexBuffer.PositionKind, positions, true, false);
            this.updateVerticesData(VertexBuffer.NormalKind, normals, true, false);
        }
    };
    /**
     * Returns a new TrailMesh object.
     * @param name is a string, the name given to the new mesh
     * @param newGenerator use new generator object for cloned trail mesh
     * @returns a new mesh
     */
    TrailMesh.prototype.clone = function (name, newGenerator) {
        if (name === void 0) { name = ""; }
        return new TrailMesh(name, (newGenerator === undefined ? this._generator : newGenerator), this.getScene(), this._diameter, this._length, this._autoStart);
    };
    /**
     * Serializes this trail mesh
     * @param serializationObject object to write serialization to
     */
    TrailMesh.prototype.serialize = function (serializationObject) {
        _super.prototype.serialize.call(this, serializationObject);
    };
    /**
     * Parses a serialized trail mesh
     * @param parsedMesh the serialized mesh
     * @param scene the scene to create the trail mesh in
     * @returns the created trail mesh
     */
    TrailMesh.Parse = function (parsedMesh, scene) {
        return new TrailMesh(parsedMesh.name, parsedMesh._generator, scene, parsedMesh._diameter, parsedMesh._length, parsedMesh._autoStart);
    };
    return TrailMesh;
}(Mesh));
export { TrailMesh };
//# sourceMappingURL=trailMesh.js.map