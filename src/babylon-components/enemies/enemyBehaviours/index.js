import { BOSS_WriggleBehaviour1 } from './BOSS_WriggleBehaviour1';
import { BOSS_WriggleBehaviour2 } from './BOSS_WriggleBehaviour2';
import { WriggleMidMinionBehaviour } from './BOSS_WriggleBehaviourTrunk/WriggleMidMinionBehaviour';
import { DefaultFairyBehaviour } from './DefaultFairyBehaviour';
import { InertMinionBehaviour } from './InertMinionBehaviour';
import { Stage1MinionBehaviour } from './Stage1MinionBehaviour';
import { StrongerStage1FairyBehaviour } from './StrongerStage1FairyBehaviour';
import { StrongStage1FairyBehaviour } from './StrongStage1FairyBehaviour';
import { TumbleweedBehaviour } from './TumbleweedBehaviour';

const behaviourMap = {
    'inertMinion': InertMinionBehaviour,
    'tumbleweed': TumbleweedBehaviour,
    'stage1Minion': Stage1MinionBehaviour,
    'defaultFairy': DefaultFairyBehaviour,
    'strongStage1Fairy': StrongStage1FairyBehaviour,
    'strongerStage1Fairy': StrongerStage1FairyBehaviour,
    'wriggle1': BOSS_WriggleBehaviour1,
    'wriggle2': BOSS_WriggleBehaviour2,
    'wriggleMidMinion': WriggleMidMinionBehaviour,
}

export const makeEnemyBehaviour = (type) => {
    const BehaviourClass = behaviourMap[type];
    if (!BehaviourClass) throw new Error('Unknown Enemy Behaviour type: ' + type);

    return BehaviourClass;
}