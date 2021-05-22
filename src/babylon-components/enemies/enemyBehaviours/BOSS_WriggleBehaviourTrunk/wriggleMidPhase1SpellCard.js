import { useContext, useEffect, useMemo } from "react";
import { WriggleMidMinionDef } from "../../../../stages/stage1def/WriggleMidMinionDef";
import { burst } from "../../../bullets/patterns/BulletVectorFunctions";
import { UIContext } from "../../../gameLogic/GeneralContainer";
import { useAddBulletGroup } from "../../../hooks/useAddBulletGroup";
import { useDoSequence } from "../../../hooks/useDoSequence";
import { makeActionListTimeline } from "../../EnemyUtils";

const enemiesInstructions = []

export const wriggleMidEnemyVectors = burst(20, 0.1, undefined, undefined, 0.6, 1.2);

wriggleMidEnemyVectors.forEach((vector, i) => enemiesInstructions.push({
    type: "enemies",
    action: 'spawn',
    enemy: WriggleMidMinionDef({ color: [1, 1, 0], targetDist: 25, armTime: 3, spawn: vector, rotationSpeed: 0.1, advance: 0.1 * i }),
    wait: 0.1
}))

const enemiesActionList = makeActionListTimeline(enemiesInstructions);

export const wriggleMidBurst = {
    type: 'shoot',
    materialOptions: {
        material: 'fresnel',
        color: [0, 0, 1]
    },
    patternOptions: {
        pattern: 'spray',
        num: difficulty => difficulty * 100,
        timeLength: 0.4,
        speed: 8,
        thetaSpeed: 4,
        startY: 0.7,
        yLength: 1.4,
        burstPerSecond: 10,
    },
    meshOptions: {
        mesh: 'sphere',
        radius: 0.5
    },
    behaviourOptions: {
        behaviour: 'linear',
    },
    lifespan: 15,
    wait: 0,
}


export const useWriggleMidPhase1SpellCard = (active, transformNodeRef, setMinionInstructions) => {
    const { setSpellCardUI } = useContext(UIContext)

    useEffect(() => {
        if (active) {
            setSpellCardUI({
                character: 'wriggle',
                spellCard: `Firefly Sign   "Comet on Earth"`
            })
        }
    }, [active, setSpellCardUI])

    const addBulletGroup = useAddBulletGroup();
    const actionsTimings = useMemo(() => [4, 7], []);
    const actions = useMemo(() =>
        [
            () => {
                setMinionInstructions([...enemiesActionList]);
                addBulletGroup(
                    transformNodeRef.current,
                    wriggleMidBurst
                );
            },
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    wriggleMidBurst
                );
            }
        ],
        //eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    useDoSequence(active, transformNodeRef, actionsTimings, actions, true);
}