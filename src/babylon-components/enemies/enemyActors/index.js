import { FairyBase } from './FairyBase';
import { FairyBaseWithMagicCircle } from './FairyBaseWithMagicCircle';
import { MinionBase } from './MinionBase';
import { TempActor } from './TempActor';
import { Tumbleweed } from './Tumbleweed';
import { Wriggle } from './Wriggle';

const meshMap = {
    'fairy': FairyBase,
    'fairyWithMagicCircle': FairyBaseWithMagicCircle,
    'minion': MinionBase,
    'tempActor': TempActor,
    'tumbleweed': Tumbleweed,
    'wriggle': Wriggle
}

export const makeEnemyMesh = (type) => {
    let EnemyMeshClass = meshMap[type];
    if (!EnemyMeshClass) throw new Error('Unknown Enemy type: ' + type);
    return EnemyMeshClass;
}