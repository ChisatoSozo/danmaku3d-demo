import { RandVector3, normalizePosition, unnormalizePosition } from '../BabylonUtils';

export const setNormPosition = (enemy, norm) => {
    const newPosition = unnormalizePosition(norm);
    enemy.position.copyFrom(newPosition);
};

export const doMove = (enemy, delta) => {
    let normPosition, dx, dxCoefficient, newNormPosition;

    switch (enemy.moveType) {
        case 'stop':
            break;
        case 'slowToStop':
            normPosition = normalizePosition(enemy.position);
            dx = enemy.moveTarget.subtract(normPosition);
            dxCoefficient = dx.length();
            newNormPosition = normPosition.add(dx.scale((dxCoefficient * delta) / 1000));
            setNormPosition(enemy, newNormPosition);
            break;
        case 'linear':
            normPosition = normalizePosition(enemy.position);
            dx = enemy.moveTarget.subtract(enemy.moveStartPosition);
            newNormPosition = normPosition.add(dx.scale(delta / enemy.moveTimeLength));
            setNormPosition(enemy, newNormPosition);
            break;
        default:
            break;
    }
};

export const newMoveAction = (enemy, moveAction) => {
    if (!enemy.position) return;

    let moveVector, normPosition;

    switch (moveAction.variant) {
        case 'slowToStop':
            enemy.moveType = 'slowToStop';
            moveVector = new RandVector3(...moveAction.target);
            enemy.moveTarget = moveVector;
            break;
        case 'linear':
            enemy.moveType = 'linear';
            moveVector = new RandVector3(...moveAction.target);
            enemy.moveTarget = moveVector;
            normPosition = normalizePosition(enemy.position);
            enemy.moveStartPosition = normPosition;
            if (moveAction.timeLength) {
                enemy.moveTimeLength = moveAction.timeLength;
                break;
            }
            enemy.moveTimeLength = moveAction.wait;
            break;
        default:
            console.warn('Unsupported move type in doMoveAction: ' + moveAction.variant);
    }
};
