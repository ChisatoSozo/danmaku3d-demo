import { Vector3 } from '@babylonjs/core';
import { globalActorRefs } from '../../gameLogic/StaticRefs';
import { BulletBehaviour } from './BulletBehaviour';

export const BULLET_TYPE = {
    BULLET: 0,
    LIFE: 1,
    BOMB: 2,
    POWER: 3,
    POINT: 4,
    SPECIAL: 5,
};

export class EnemyBulletBehaviour extends BulletBehaviour {
    constructor(positionShader, velocityShader, parent, collideWithEnvironment, initialValuesFunction, radius, bulletType = 0, bulletValue = 1) {
        const enemyInitialValuesFunction = (texture) => {
            if (initialValuesFunction) initialValuesFunction(texture);
            texture.setFloats('bombPositions', globalActorRefs.bombPositionBuffer);
            texture.setFloats('bombRadii', globalActorRefs.bombRadiiBuffer);
        }

        super(positionShader, velocityShader, parent, collideWithEnvironment, enemyInitialValuesFunction, radius, bulletValue);
        this.collisionShader = 'enemyBulletCollision';
        this.isEnemyBullet = true;
        this.isPlayerBullet = false;
        this.bulletType = bulletType;
    }

    update(deltaS) {
        return super.update(deltaS);
    }

    bindCollisionVars = (texture) => {
        super.bindCollisionVars(texture);
        const typeVector1 = new Vector3(0, 0, 0);
        const typeVector2 = new Vector3(0, 0, 0);

        switch (this.bulletType) {
            case 0:
                typeVector1.x = this.bulletValue;
                break; //bullet
            case 1:
                typeVector1.y = this.bulletValue;
                break; //life
            case 2:
                typeVector1.z = this.bulletValue;
                break; //bomb
            case 3:
                typeVector2.x = this.bulletValue;
                break; //power
            case 4:
                typeVector2.y = this.bulletValue;
                break; //point
            case 5:
                typeVector2.z = this.bulletValue;
                break; //special
            default:
                throw new Error('Invalid bullet type ' + this.bulletType);
        }
        const radius = this.radius;

        texture.setVector3('bulletTypePack1', typeVector1);
        texture.setVector3('bulletTypePack2', typeVector2);
        texture.setFloat('bulletRadius', radius);
        texture.setVector3('playerPosition', globalActorRefs.player.position);
        texture.setFloats('bombPositions', globalActorRefs.bombPositionBuffer);
        texture.setFloats('bombRadii', globalActorRefs.bombRadiiBuffer);
    };
}
