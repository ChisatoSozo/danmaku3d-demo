import { extraFlower1, extraFlower2, extraFlower3, extraSpray, extraSprayBigSphere, extraSprayFreezeAndTurnYellow } from "../babylon-components/enemies/enemyBehaviours/BOSS_WriggleBehaviourTrunk/wriggleExtraPhase1SpellCard"
import { traceArray, traceReplaceArray } from "../babylon-components/enemies/enemyBehaviours/BOSS_WriggleBehaviourTrunk/WriggleMidMinionBehaviour"
import { wriggleMidBurst } from "../babylon-components/enemies/enemyBehaviours/BOSS_WriggleBehaviourTrunk/wriggleMidPhase1SpellCard"
import { burst1, burst1Turn, burst2, burst2Turn, slash1, slash2, slash3, slash4, slash5, slash6, slash7, slash8 } from "../babylon-components/enemies/enemyBehaviours/BOSS_WriggleBehaviourTrunk/wrigglePhase1Normal"
import { wrigglePhase1Spray, wrigglePhase1Spray2, wrigglePhase1Spray2Turn } from "../babylon-components/enemies/enemyBehaviours/BOSS_WriggleBehaviourTrunk/wrigglePhase1SpellCard"
import { greenBurst1, greenBurst2, greenBurst3, greenBurst4 } from "../babylon-components/enemies/enemyBehaviours/BOSS_WriggleBehaviourTrunk/wrigglePhase2Normal"
import { flower1, flower2, flower3, spray, sprayBigSphere, sprayFreezeAndTurnYellow } from "../babylon-components/enemies/enemyBehaviours/BOSS_WriggleBehaviourTrunk/wrigglePhase2SpellCard"
import { blueSmall, whiteSmall, yellowSmall } from "../babylon-components/enemies/enemyBehaviours/Stage1MinionBehaviour"
import { cone, strongerMultiBurst } from "../babylon-components/enemies/enemyBehaviours/StrongerStage1FairyBehaviour"
import { area, multiBurst } from "../babylon-components/enemies/enemyBehaviours/StrongStage1FairyBehaviour"

export const setupStage1 = (preComputeBulletGroup) => {

    traceArray.forEach(trace => preComputeBulletGroup(trace));
    traceReplaceArray.forEach(trace => preComputeBulletGroup(trace));
    preComputeBulletGroup(wriggleMidBurst);

    preComputeBulletGroup(slash1)
    preComputeBulletGroup(slash2)
    preComputeBulletGroup(slash3)
    preComputeBulletGroup(slash4)
    preComputeBulletGroup(slash5)
    preComputeBulletGroup(slash6)
    preComputeBulletGroup(slash7)
    preComputeBulletGroup(slash8)

    preComputeBulletGroup(greenBurst1)
    preComputeBulletGroup(greenBurst2)
    preComputeBulletGroup(greenBurst3)
    preComputeBulletGroup(greenBurst4)

    preComputeBulletGroup(burst1)
    preComputeBulletGroup(burst2)
    preComputeBulletGroup(burst1Turn);
    preComputeBulletGroup(burst2Turn);

    preComputeBulletGroup(wrigglePhase1Spray)
    preComputeBulletGroup(wrigglePhase1Spray2)
    preComputeBulletGroup(wrigglePhase1Spray2Turn);

    preComputeBulletGroup(spray);
    preComputeBulletGroup(sprayBigSphere);
    preComputeBulletGroup(sprayFreezeAndTurnYellow);
    preComputeBulletGroup(flower1);
    preComputeBulletGroup(flower2);
    preComputeBulletGroup(flower3);

    preComputeBulletGroup(extraSpray);
    preComputeBulletGroup(extraSprayBigSphere);
    preComputeBulletGroup(extraSprayFreezeAndTurnYellow);
    preComputeBulletGroup(extraFlower1);
    preComputeBulletGroup(extraFlower2);
    preComputeBulletGroup(extraFlower3);

    preComputeBulletGroup(yellowSmall);
    preComputeBulletGroup(whiteSmall);
    preComputeBulletGroup(blueSmall);

    preComputeBulletGroup(multiBurst);
    preComputeBulletGroup(area);

    preComputeBulletGroup(strongerMultiBurst);
    preComputeBulletGroup(cone);
}