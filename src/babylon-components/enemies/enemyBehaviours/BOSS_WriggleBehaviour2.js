import { flattenDeep } from 'lodash';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useBeforeRender } from 'react-babylonjs';
import { globals } from '../../../components/GlobalsContainer';
import { LSContext } from '../../../components/LSContainer';
import Music from '../../../sounds/Music';
import { randVectorToPosition } from '../../BabylonUtils';
import { AnimationContext, BulletsContext, UIContext } from '../../gameLogic/GeneralContainer';
import { globalActorRefs, globalCallbacks } from '../../gameLogic/StaticRefs';
import { useAddEffect } from '../../hooks/useAddEffect';
import { moveTo } from "./BehaviourCommon";
import { useWriggleExtraPhase1SpellCard } from './BOSS_WriggleBehaviourTrunk/wriggleExtraPhase1SpellCard';
import { useWrigglePhase1Normal } from './BOSS_WriggleBehaviourTrunk/wrigglePhase1Normal';
import { useWrigglePhase1SpellCard } from './BOSS_WriggleBehaviourTrunk/wrigglePhase1SpellCard';
import { useWrigglePhase2Normal } from './BOSS_WriggleBehaviourTrunk/wrigglePhase2Normal';


const wriggle2StartPosition = randVectorToPosition([9, 1, 3])

const lives = [
    {
        healthStart: 18000,
        healthEnd: 12000,
        spellCards: [15000]
    },
    {
        healthStart: 12000,
        healthEnd: 3000,
        spellCards: [9000]
    },
]

const phases = flattenDeep(lives.map(life => (
    [life.spellCards, life.healthEnd]
)))

export const BOSS_WriggleBehaviour2 = ({ children, leaveScene, spawn }) => {
    const transformNodeRef = useRef();

    const { setBossUI, setSpellCardUI } = useContext(UIContext)
    const { registerAnimation } = useContext(AnimationContext);
    const { clearAllBullets } = useContext(BulletsContext);
    const addEffect = useAddEffect()
    const [epoch, setEpoch] = useState(-1);
    const { ls } = useContext(LSContext)

    useEffect(() => {
        moveTo(registerAnimation, transformNodeRef.current, [0, 0, 1])
        globalCallbacks.bossStart = () => setEpoch(0)
    }, [registerAnimation])

    useEffect(() => {
        if (epoch === 0) {
            Music.play("wriggleTheme")
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
        if (epoch === 4) {
            setBossUI()
            setSpellCardUI()
            const deathLocation = transformNodeRef.current.getAbsolutePosition()
            window.setTimeout(() => {
                leaveScene()
                addEffect(deathLocation, {
                    type: 'particles',
                    name: "wriggleDeath",
                    duration: 200
                })
            }, 1000);
            window.setTimeout(() => {
                ls("NEW_SCORE", globals.SCORE)
                window.location.href = '/menu/game/score';
            }, 2000);
        }
    }, [registerAnimation, setBossUI, epoch, addEffect, setSpellCardUI, leaveScene, ls])

    useEffect(() => {
        clearAllBullets();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [epoch])

    useWrigglePhase1Normal(epoch === 0, transformNodeRef)
    useWrigglePhase1SpellCard(epoch === 1, transformNodeRef)
    useWrigglePhase2Normal(epoch === 2, transformNodeRef)
    useWriggleExtraPhase1SpellCard(epoch === 3, transformNodeRef)

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
        <transformNode name position={wriggle2StartPosition} ref={transformNodeRef}>
            {children}

        </transformNode>
    );
};
