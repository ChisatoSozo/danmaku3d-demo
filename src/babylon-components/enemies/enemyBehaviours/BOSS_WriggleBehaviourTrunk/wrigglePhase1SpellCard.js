import { useContext, useEffect, useMemo } from "react";
import { makeReplaceInstruction } from "../../../bullets/BulletUtils";
import { AnimationContext, UIContext } from "../../../gameLogic/GeneralContainer";
import { useAddBulletGroup } from "../../../hooks/useAddBulletGroup";
import { useAddEffect } from "../../../hooks/useAddEffect";
import { useDoSequence } from "../../../hooks/useDoSequence";
import { moveTo } from "../BehaviourCommon";

export const wrigglePhase1Spray = {
    type: 'shoot',
    materialOptions: {
        material: 'fresnel',
        color: [0, 1, 0]
    },
    patternOptions: {
        pattern: 'sprayStableRandBurst',
        num: difficulty => difficulty * 100,
        timeLength: 7,
        speed: 12
    },
    meshOptions: {
        mesh: 'egg',
        radius: 0.2
    },
    behaviourOptions: {
        behaviour: 'linear',
    },
    lifespan: 10,
    wait: 0,
}

export const wrigglePhase1Spray2 = {
    type: 'shoot',
    materialOptions: {
        material: 'fresnel',
        color: [0, 1, 1]
    },
    patternOptions: {
        pattern: 'sprayStableRandBurst',
        num: difficulty => difficulty * 100,
        timeLength: 7,
        speed: 15,
        uid: 'wrigglePhase1SprayInit',
    },
    meshOptions: {
        mesh: 'egg',
        radius: 0.2
    },
    behaviourOptions: {
        behaviour: 'slowToStop',
    },
    lifespan: 10,
    wait: 0,
    endTimings: {
        timing: 'uniform',
        time: 2,
        uid: 'wrigglePhase1SprayInit',
    },
}

export const wrigglePhase1Spray2Turn = makeReplaceInstruction(wrigglePhase1Spray2, {
    patternOptions: {
        type: 'rotateVelocity',
        rotation: Math.PI / 3,
    },
    behaviourOptions: {
        behaviour: 'linear',
    },
})

export const useWrigglePhase1SpellCard = (active, transformNodeRef) => {
    const { setSpellCardUI } = useContext(UIContext)
    const { registerAnimation } = useContext(AnimationContext);
    const addEffect = useAddEffect()

    useEffect(() => {
        if (active) {
            setSpellCardUI({
                character: 'wriggle',
                spellCard: `Lamp Sign   "Firefly Phenomenon"`
            })
        }
    }, [active, setSpellCardUI])

    const addBulletGroup = useAddBulletGroup();
    const actionsTimings = useMemo(() => [0, 2, 11], []);
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
                addBulletGroup(
                    transformNodeRef.current,
                    wrigglePhase1Spray
                )
                const id = addBulletGroup(
                    transformNodeRef.current,
                    wrigglePhase1Spray2
                )
                addBulletGroup(
                    transformNodeRef.current,
                    wrigglePhase1Spray2Turn,
                    id
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