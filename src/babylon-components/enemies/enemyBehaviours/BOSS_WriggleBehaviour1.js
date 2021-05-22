import { Vector3 } from '@babylonjs/core';
import { flattenDeep } from 'lodash';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useBeforeRender } from 'react-babylonjs';
import { randVectorToPosition } from '../../BabylonUtils';
import { AnimationContext, BulletsContext, UIContext } from '../../gameLogic/GeneralContainer';
import { globalActorRefs, globalCallbacks } from '../../gameLogic/StaticRefs';
import { useAddBulletGroup } from '../../hooks/useAddBulletGroup';
import { useAddEffect } from '../../hooks/useAddEffect';
import { Enemies } from '../Enemies';
import { moveTo } from "./BehaviourCommon";
import { useWriggleMidPhase1Normal } from './BOSS_WriggleBehaviourTrunk/wriggleMidPhase1Normal';
import { useWriggleMidPhase1SpellCard } from './BOSS_WriggleBehaviourTrunk/wriggleMidPhase1SpellCard';

const wriggle1StartPosition = randVectorToPosition([9, 1, 3])

const lives = [
    {
        healthStart: 4000,
        healthEnd: 1000,
        spellCards: [2500]
    },
]


const phases = flattenDeep(lives.map(life => (
    [life.spellCards, life.healthEnd]
)))

export const BOSS_WriggleBehaviour1 = ({ children, leaveScene, spawn }) => {
    const transformNodeRef = useRef();

    const { setBossUI, setSpellCardUI } = useContext(UIContext)
    const { registerAnimation } = useContext(AnimationContext);
    const { clearAllBullets } = useContext(BulletsContext);
    const addEffect = useAddEffect()
    const [epoch, setEpoch] = useState(0);
    const [minionInstructions, setMinionInstructions] = useState([]);
    const addBulletGroup = useAddBulletGroup();

    useEffect(() => {
        moveTo(registerAnimation, transformNodeRef.current, [0, 0, 1])
        globalCallbacks.bossStart = () => setEpoch(0)
    }, [registerAnimation])

    useEffect(() => {
        if (epoch === 0) {
            setBossUI({
                bossName: "wriggle",
                lives
            })
        }
        if (epoch > 0) {
            addEffect(transformNodeRef.current, {
                type: 'particles',
                name: "newPhaseWriggle",
                duration: 200
            })
        }
        if (epoch === 2) {
            setBossUI()
            setSpellCardUI()

            moveTo(registerAnimation, transformNodeRef.current, new Vector3(100, 1, 10))
            window.setTimeout(() => {
                leaveScene()
            }, 1000);
        }
    }, [registerAnimation, setBossUI, epoch, addEffect, setSpellCardUI, leaveScene, addBulletGroup])

    useEffect(() => {
        clearAllBullets();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [epoch])

    useWriggleMidPhase1Normal(epoch === 0, transformNodeRef)
    useWriggleMidPhase1SpellCard(epoch === 1, transformNodeRef, setMinionInstructions)

    useBeforeRender(() => {
        const bossHealth = globalActorRefs.enemies[0].health;
        if (epoch === -1 || bossHealth <= -510) return;

        let curPhase = 0;
        for (let i = 0; i < phases.length; i++) {
            if (bossHealth > phases[i]) {
                curPhase = i;
                break;
            }
        }

        if (bossHealth < phases[phases.length - 1]) {
            curPhase = phases.length;
        }

        if (curPhase !== epoch) {

            setEpoch(curPhase);
        }
    })

    return (
        <transformNode name position={wriggle1StartPosition} ref={transformNodeRef}>
            <Enemies currentActionList={minionInstructions} />
            {children}

        </transformNode>
    );
};
