import { useContext, useEffect, useMemo } from "react";
import { makeReplaceInstruction } from "../../../bullets/BulletUtils";
import { AnimationContext, UIContext } from "../../../gameLogic/GeneralContainer";
import { useAddBulletGroup } from "../../../hooks/useAddBulletGroup";
import { useAddEffect } from "../../../hooks/useAddEffect";
import { useDoSequence } from "../../../hooks/useDoSequence";
import { moveTo } from "../BehaviourCommon";

export const extraSpray = {
    type: 'shoot',
    materialOptions: {
        material: 'fresnel',
        color: [0.9, 0.9, 0.9]
    },
    patternOptions: {
        pattern: 'sprayStableRandBurst',
        num: difficulty => difficulty * 90,
        timeLength: 7,
        speed: 8,
        thetaSpeed: 0.3,
        burstPerSecond: 24,
        startY: 0.7,
        yLength: 1.4,
        uid: 'wriggleSprayInitExtra',
    },
    endTimings: {
        timing: 'uniform',
        time: 2,
        uid: 'wriggleSprayInitExtra',
    },
    meshOptions: {
        mesh: 'sphere',
        radius: 0.1
    },
    behaviourOptions: {
        behaviour: 'slowToStop',
    },
    lifespan: 15,
    wait: 0,
}

export const extraSprayBigSphere = makeReplaceInstruction(extraSpray, {
    patternOptions: {
        type: 'rotateVelocity',
        rotation: Math.PI / 2,
    },
    meshOptions: {
        radius: 0.2
    },
    behaviourOptions: {
        behaviour: 'linear',
    },
    endTimings: {
        time: 1,
    },
})

export const extraSprayFreezeAndTurnYellow = makeReplaceInstruction(extraSprayBigSphere, {
    materialOptions: {
        color: [1, 1, 0]
    },
    patternOptions: {
        type: 'rotateVelocity',
        rotation: 0,
        velocityMultiplier: 0.001,
    },
    meshOptions: {
        radius: 0.1
    },
    behaviourOptions: {
        behaviour: 'linear',
    },
    endTimings: {
        time: 1,
    },
})

export const extraFlower1 = makeReplaceInstruction(extraSprayFreezeAndTurnYellow, {
    materialOptions: {
        color: [1, 1, 0]
    },
    patternOptions: {
        type: 'rotateVelocity',
        rotation: -Math.PI / 2,
        velocityMultiplier: 500,
    },
    meshOptions: {
        mesh: 'egg',
    },
    behaviourOptions: {
        behaviour: 'linear',
    },
    endTimings: {
        timing: 'lifespan',
    },
})

export const extraFlower2 = makeReplaceInstruction(extraSprayFreezeAndTurnYellow, {
    materialOptions: {
        color: [0, 1, 1]
    },
    patternOptions: {
        type: 'rotateVelocity',
        rotation: 0,
        velocityMultiplier: 500,
    },
    meshOptions: {
        mesh: 'egg',
    },
    behaviourOptions: {
        behaviour: 'linear',
    },
    endTimings: {
        timing: 'lifespan',
    },
})

export const extraFlower3 = makeReplaceInstruction(extraSprayFreezeAndTurnYellow, {
    materialOptions: {
        color: [0, 1, 0]
    },
    patternOptions: {
        type: 'rotateVelocity',
        rotation: Math.PI / 2,
        velocityMultiplier: 1000,
    },
    meshOptions: {
        mesh: 'egg',
    },
    behaviourOptions: {
        behaviour: 'linear',
    },
    endTimings: {
        timing: 'lifespan',
    },
})


export const useWriggleExtraPhase1SpellCard = (active, transformNodeRef) => {
    const { setSpellCardUI } = useContext(UIContext)
    const { registerAnimation } = useContext(AnimationContext);
    const addEffect = useAddEffect()

    useEffect(() => {
        if (active) {
            setSpellCardUI({
                character: 'wriggle',
                spellCard: `Wriggle Sign   "Nightbug Tornado"`
            })
        }
    }, [active, setSpellCardUI])

    const addBulletGroup = useAddBulletGroup();
    const actionsTimings = useMemo(() => [0, 2, 15], []);
    const actions = useMemo(() =>
        [
            () => {
                addEffect(transformNodeRef.current, {
                    type: 'particles',
                    name: 'chargeWriggle',
                    duration: 1000
                })
            },
            () => {
                const id = addBulletGroup(
                    transformNodeRef.current,
                    extraSpray
                )
                const id2 = addBulletGroup(
                    transformNodeRef.current,
                    extraSprayBigSphere,
                    id
                )
                const id3 = addBulletGroup(
                    transformNodeRef.current,
                    extraSprayFreezeAndTurnYellow,
                    id2
                )
                addBulletGroup(
                    transformNodeRef.current,
                    extraFlower1,
                    id3
                )
                addBulletGroup(
                    transformNodeRef.current,
                    extraFlower2,
                    id3
                )
                addBulletGroup(
                    transformNodeRef.current,
                    extraFlower3,
                    id3
                )
            },
            () => {
                moveTo(registerAnimation, transformNodeRef.current, [[-0.8, 0.8], [-0.8, 0.8], [0.8, 1.0]])
            },
        ],
        //eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    useDoSequence(active, transformNodeRef, actionsTimings, actions, true);
}