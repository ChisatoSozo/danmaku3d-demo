import { globalActorRefs } from '../../gameLogic/StaticRefs';
import { BulletBehaviour } from './BulletBehaviour';

export class PlayerBulletBehaviour extends BulletBehaviour {
    constructor(positionShader, velocityShader, parent, collideWithEnvironment, initialValuesFunction, bulletValue) {
        const playerInitialValuesFunction = (texture) => {
            if (initialValuesFunction) initialValuesFunction(texture);
            texture.setFloats('enemyPositions', globalActorRefs.enemyPositionBuffer);
            texture.setFloats('enemyRadii', globalActorRefs.enemyRadiiBuffer);
        }

        super(positionShader, velocityShader, parent, collideWithEnvironment, playerInitialValuesFunction, 1, bulletValue);
        this.collisionShader = 'playerBulletCollision';
        this.isEnemyBullet = false;
        this.isPlayerBullet = true;
    }

    bindCollisionVars = (texture) => {
        super.bindCollisionVars(texture);
        texture.setFloats('enemyPositions', globalActorRefs.enemyPositionBuffer);
        texture.setFloats('enemyRadii', globalActorRefs.enemyRadiiBuffer);
    };

    update(deltaS) {
        const updateResult = super.update(deltaS);
        if (updateResult) {
            updateResult.forEach((texture) => {
                texture.setFloats('enemyPositions', globalActorRefs.enemyPositionBuffer);
                texture.setFloats('enemyRadii', globalActorRefs.enemyRadiiBuffer);
            });
        }
        return updateResult;
    }
}
