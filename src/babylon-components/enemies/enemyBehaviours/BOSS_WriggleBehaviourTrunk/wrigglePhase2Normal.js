import { useContext, useEffect, useMemo } from "react";
import { AnimationContext, UIContext } from "../../../gameLogic/GeneralContainer";
import { useAddBulletGroup } from "../../../hooks/useAddBulletGroup";
import { useDoSequence } from "../../../hooks/useDoSequence";
import { moveTo } from "../BehaviourCommon";

const greenBurst = () => ({
    type: 'shoot',
    materialOptions: {
        material: 'fresnel',
        color: [0, 1, 0]
    },
    patternOptions: {
        pattern: 'multiBurst',
        speeds: [5, 10],
        num: difficulty => difficulty * 600,
        thetaStart: Math.random() * Math.PI * 2
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
})

export const greenBurst1 = greenBurst();
export const greenBurst2 = greenBurst();
export const greenBurst3 = greenBurst();
export const greenBurst4 = greenBurst();

export const useWrigglePhase2Normal = (active, transformNodeRef) => {
    const addBulletGroup = useAddBulletGroup();
    const { registerAnimation } = useContext(AnimationContext);
    const { setSpellCardUI } = useContext(UIContext)

    useEffect(() => {
        if (active) {
            setSpellCardUI(null)
        }
    }, [active, setSpellCardUI])

    const actionsTimings = useMemo(() => [1, 2, 3, 4, 5], []);
    const actions = useMemo(() =>
        [
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    greenBurst1
                )
            },
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    greenBurst2
                )
            },
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    greenBurst3
                )
            },
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    greenBurst4
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