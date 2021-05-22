import { useContext, useMemo } from "react";
import { rotateVector } from "../../../BabylonUtils";
import { AnimationContext } from "../../../gameLogic/GeneralContainer";
import { globalActorRefs } from "../../../gameLogic/StaticRefs";
import { useAddBulletGroup } from "../../../hooks/useAddBulletGroup";
import { useAddEffect } from "../../../hooks/useAddEffect";
import { useDoSequence } from "../../../hooks/useDoSequence";
import { moveTo } from "../BehaviourCommon";
import { burst1, burst1Turn, burst2, burst2Turn } from "./wrigglePhase1Normal";

const makePincer = (transformNodeRef, roll) => {
    const parent = transformNodeRef.current;
    const forward = globalActorRefs.player.position.subtract(parent.getAbsolutePosition())

    const from = rotateVector(rotateVector(forward, Math.PI / 12, 0), 0, 0, roll);
    const to = rotateVector(rotateVector(forward, -Math.PI / 12, 0), 0, 0, roll);

    return {
        type: 'shoot',
        materialOptions: {
            material: 'fresnel',
            color: [0, 1, 1]
        },
        patternOptions: {
            pattern: 'multiArc',
            num: difficulty => difficulty * 7,
            speeds: [4, 5, 6, 7],
            from: [from.x, from.y, from.z],
            to: [to.x, to.y, to.z],
            towardsPlayer: true
        },
        meshOptions: {
            mesh: 'sphere',
            radius: 0.2
        },
        behaviourOptions: {
            behaviour: 'linear',
        },
        lifespan: 10,
        wait: 0,
    }
}

const makePincer1 = (transformNodeRef, roll) => {
    const parent = transformNodeRef.current;
    const forward = globalActorRefs.player.position.subtract(parent.getAbsolutePosition())

    const from = rotateVector(rotateVector(forward, Math.PI / 8, Math.PI / 25), 0, 0, roll);
    const to = rotateVector(rotateVector(forward, -Math.PI / 8, Math.PI / 25), 0, 0, roll);

    return {
        type: 'shoot',
        materialOptions: {
            material: 'fresnel',
            color: [0, 0, 1]
        },
        patternOptions: {
            pattern: 'multiArc',
            num: difficulty => difficulty * 7,
            speeds: [4, 5, 6, 7],
            from: [from.x, from.y, from.z],
            to: [to.x, to.y, to.z],
            towardsPlayer: true
        },
        meshOptions: {
            mesh: 'sphere',
            radius: 0.2
        },
        behaviourOptions: {
            behaviour: 'linear',
        },
        lifespan: 10,
        wait: 0,
    }
}

const makePincer2 = (transformNodeRef, roll) => {
    const parent = transformNodeRef.current;
    const forward = globalActorRefs.player.position.subtract(parent.getAbsolutePosition())

    const from = rotateVector(rotateVector(forward, Math.PI / 8, -Math.PI / 25), 0, 0, roll);
    const to = rotateVector(rotateVector(forward, -Math.PI / 8, -Math.PI / 25), 0, 0, roll);

    return {
        type: 'shoot',
        materialOptions: {
            material: 'fresnel',
            color: [0, 0, 1]
        },
        patternOptions: {
            pattern: 'multiArc',
            num: difficulty => difficulty * 7,
            speeds: [4, 5, 6, 7],
            from: [from.x, from.y, from.z],
            to: [to.x, to.y, to.z],
            towardsPlayer: true
        },
        meshOptions: {
            mesh: 'sphere',
            radius: 0.2
        },
        behaviourOptions: {
            behaviour: 'linear',
        },
        lifespan: 10,
        wait: 0,
    }
}

export const useWriggleMidPhase1Normal = (active, transformNodeRef, setMinionInstructions) => {
    const addBulletGroup = useAddBulletGroup();
    const { registerAnimation } = useContext(AnimationContext);
    const addEffect = useAddEffect()
    const actionsTimings = useMemo(() => [1, 3, 4, 5, 6, 10, 11, 12, 13, 15], []);
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
                    burst1
                )

                addBulletGroup(
                    transformNodeRef.current,
                    burst1Turn,
                    id
                )
            },
            () => {
                const id = addBulletGroup(
                    transformNodeRef.current,
                    burst2
                )
                addBulletGroup(
                    transformNodeRef.current,
                    burst2Turn,
                    id
                )
            },
            () => {
                const id = addBulletGroup(
                    transformNodeRef.current,
                    burst1
                )

                addBulletGroup(
                    transformNodeRef.current,
                    burst1Turn,
                    id
                )
            },
            () => {
                moveTo(registerAnimation, transformNodeRef.current, [[-0.8, 0.8], [-0.8, 0.8], [0.8, 1.0]])
            },
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    makePincer(transformNodeRef, 0)
                )
                addBulletGroup(
                    transformNodeRef.current,
                    makePincer1(transformNodeRef, 0)
                )
                addBulletGroup(
                    transformNodeRef.current,
                    makePincer2(transformNodeRef, 0)
                )
                addBulletGroup(
                    transformNodeRef.current,
                    makePincer(transformNodeRef, -Math.PI / 2)
                )
                addBulletGroup(
                    transformNodeRef.current,
                    makePincer1(transformNodeRef, -Math.PI / 2)
                )
                addBulletGroup(
                    transformNodeRef.current,
                    makePincer2(transformNodeRef, -Math.PI / 2)
                )
            },
            () => {
                moveTo(registerAnimation, transformNodeRef.current, [[-0.8, 0.8], [-0.8, 0.8], [0.8, 1.0]])
            },
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    makePincer(transformNodeRef, 0)
                )
                addBulletGroup(
                    transformNodeRef.current,
                    makePincer1(transformNodeRef, 0)
                )
                addBulletGroup(
                    transformNodeRef.current,
                    makePincer2(transformNodeRef, 0)
                )
                addBulletGroup(
                    transformNodeRef.current,
                    makePincer(transformNodeRef, -Math.PI / 2)
                )
                addBulletGroup(
                    transformNodeRef.current,
                    makePincer1(transformNodeRef, -Math.PI / 2)
                )
                addBulletGroup(
                    transformNodeRef.current,
                    makePincer2(transformNodeRef, -Math.PI / 2)
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