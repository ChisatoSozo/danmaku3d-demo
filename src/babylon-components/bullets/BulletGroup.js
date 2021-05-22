export class BulletGroup {
    constructor(props) {
        Object.assign(this, props)
    }

    dispose() {
        this.material.dispose();
        this.behaviour.dispose();

        if (this.mesh.isPooled) {
            this.mesh.thinInstanceSetBuffer("matrix", new Float32Array([
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0
            ]), 16);
            this.releaseMesh(this.mesh)
        }
        else {
            this.mesh.dispose()
        }
    }
}
