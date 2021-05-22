import { useContext, useMemo } from "react";
import { AnimationContext } from "../../../gameLogic/GeneralContainer";
import { useDoSequence } from "../../../hooks/useDoSequence";
import { moveTo } from "../BehaviourCommon";

export const useMoveTest = (active, transformNodeRef) => {
    const { registerAnimation } = useContext(AnimationContext);
    const actionsTimings = useMemo(() => [1], []);
    const actions = useMemo(() =>
        [() => {
            moveTo(registerAnimation, transformNodeRef.current, [[-0.8, 0.8], [-0.8, 0.8], [0.8, 1.0]])
        }
        ],
        //eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    useDoSequence(active, transformNodeRef, actionsTimings, actions, true);
}