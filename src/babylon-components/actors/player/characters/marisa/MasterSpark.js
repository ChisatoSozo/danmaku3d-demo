import { Animation, Color3, Vector3 } from '@babylonjs/core'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useBeforeRender, useScene } from 'react-babylonjs'
import { playerBombCharge, playerMasterSpark } from '../../../../../sounds/SFX'
import { AnimationContext } from '../../../../gameLogic/GeneralContainer'
import { addBomb, globalActorRefs, removeBomb, setBombPosition, setBombRadius } from '../../../../gameLogic/StaticRefs'
import { useGlowLayer } from '../../../../gameLogic/useGlowLayer'
import { useDoSequence } from '../../../../hooks/useDoSequence'
import { useName } from '../../../../hooks/useName'
import { useTexture } from '../../../../hooks/useTexture'
import { MasterSparkBeam } from './MasterSparkBeam'

export const MasterSpark = (props) => {
    const name = useName()
    const runeEmpty = useTexture("runeEmpty")
    const circle1Ref = useRef()
    const circle2Ref = useRef()
    const circle3Ref = useRef()
    const circle4Ref = useRef()
    const masterSparkRef = useRef();
    const masterSparkTransformNode = useRef();
    const initialBeamScaling = useMemo(() => new Vector3(0, 0, 0), []);
    const transformNodeRef = useRef();
    const scene = useScene()
    const { registerAnimation } = useContext(AnimationContext)
    const glowLayer = useGlowLayer();
    const [beamActive, setBeamActive] = useState();

    useEffect(() => {
        const x1 = 1;
        const x2 = 3;
        const x3 = 6;
        const x4 = 10;

        const y = (x) => {
            return Math.pow(x, 0.8);
        }

        circle1Ref.current.position = new Vector3(0, 0, x1)
        const y1 = y(x1);
        circle1Ref.current.targetScaling = new Vector3(y1, y1, y1).scale(1.6);

        circle2Ref.current.position = new Vector3(0, 0, x2)
        const y2 = y(x2);
        circle2Ref.current.targetScaling = new Vector3(y2, y2, y2).scale(1.6);

        circle3Ref.current.position = new Vector3(0, 0, x3)
        const y3 = y(x3);
        circle3Ref.current.targetScaling = new Vector3(y3, y3, y3).scale(1.6);

        circle4Ref.current.position = new Vector3(0, 0, x4)
        const y4 = y(x4);
        circle4Ref.current.targetScaling = new Vector3(y4, y4, y4).scale(1.6);

        glowLayer.addIncludedOnlyMesh(circle1Ref.current)
        glowLayer.addIncludedOnlyMesh(circle2Ref.current)
        glowLayer.addIncludedOnlyMesh(circle3Ref.current)
        glowLayer.addIncludedOnlyMesh(circle4Ref.current)

    }, [glowLayer, name, scene])

    const masterSparkTimings = useMemo(() => [0, 0.5, 1.2, 2.1, 3.6], []);
    const masterSparkActions = useMemo(() => [
        () => {
            playerBombCharge.play();
            registerAnimation(
                Animation.CreateAndStartAnimation(
                    name + "anim",
                    circle1Ref.current,
                    "scaling",
                    1,
                    0.5,
                    circle1Ref.current.scaling,
                    circle1Ref.current.targetScaling,
                    Animation.ANIMATIONLOOPMODE_CONSTANT
                )
            )
            Animation.CreateAndStartAnimation(
                name + "spinanim",
                circle1Ref.current,
                'rotation',
                2,
                6,
                new Vector3(0, 0, 0),
                new Vector3(0, 0, -Math.PI * 2),
                Animation.ANIMATIONLOOPMODE_CYCLE,
            )
        },
        () => {
            registerAnimation(
                Animation.CreateAndStartAnimation(
                    name + "anim",
                    circle2Ref.current,
                    "scaling",
                    1,
                    0.7,
                    circle2Ref.current.scaling,
                    circle2Ref.current.targetScaling,
                    Animation.ANIMATIONLOOPMODE_CONSTANT
                )
            )
            Animation.CreateAndStartAnimation(
                name + "spinanim",
                circle2Ref.current,
                'rotation',
                2,
                6,
                new Vector3(0, 0, 0),
                new Vector3(0, 0, Math.PI * 2),
                Animation.ANIMATIONLOOPMODE_CYCLE,
            )
        },
        () => {
            registerAnimation(
                Animation.CreateAndStartAnimation(
                    name + "anim",
                    circle3Ref.current,
                    "scaling",
                    1,
                    0.9,
                    circle3Ref.current.scaling,
                    circle3Ref.current.targetScaling,
                    Animation.ANIMATIONLOOPMODE_CONSTANT
                )
            )
            Animation.CreateAndStartAnimation(
                name + "spinanim",
                circle3Ref.current,
                'rotation',
                2,
                6,
                new Vector3(0, 0, 0),
                new Vector3(0, 0, -Math.PI * 2),
                Animation.ANIMATIONLOOPMODE_CYCLE,
            )
        },
        () => {
            registerAnimation(
                Animation.CreateAndStartAnimation(
                    name + "anim",
                    circle4Ref.current,
                    "scaling",
                    1,
                    1.1,
                    circle4Ref.current.scaling,
                    circle4Ref.current.targetScaling,
                    Animation.ANIMATIONLOOPMODE_CONSTANT
                )
            )
            Animation.CreateAndStartAnimation(
                name + "spinanim",
                circle4Ref.current,
                'rotation',
                2,
                6,
                new Vector3(0, 0, 0),
                new Vector3(0, 0, Math.PI * 2),
                Animation.ANIMATIONLOOPMODE_CYCLE,
            )
        },
        () => {
            for (let i = 0; i < 7; i++) {
                addBomb(i, transformNodeRef.current.getAbsolutePosition().add(new Vector3(0, 0, i * 3)), 0)
            }

            playerMasterSpark.play();
            registerAnimation(
                Animation.CreateAndStartAnimation(
                    name + "anim",
                    masterSparkRef.current,
                    "scaling",
                    1,
                    0.6,
                    masterSparkRef.current.scaling,
                    new Vector3(1, 1, 1),
                    Animation.ANIMATIONLOOPMODE_CONSTANT
                )
            )
            setBeamActive(true);
        }
    ], [name, registerAnimation]);
    useDoSequence(true, circle1Ref, masterSparkTimings, masterSparkActions);

    useEffect(() => {
        return () => {
            for (let i = 0; i < 7; i++) {
                removeBomb(i)
            }
        }
    }, []);

    useBeforeRender(() => {
        if (!beamActive || !masterSparkTransformNode.current) return;

        const scale = Math.max(Math.random() * 2, 1.0);
        masterSparkTransformNode.current.scaling = new Vector3(scale, scale, scale);

        for (let i = 0; i < 7; i++) {
            setBombPosition(i, transformNodeRef.current.getAbsolutePosition().add(new Vector3(0, 0, i * 3)))
            setBombRadius(i, scale * 4);
        }

        globalActorRefs.enemies.forEach((enemy, id) => {
            if (enemy.dead) return;
            const lazerPos = transformNodeRef.current.getAbsolutePosition()
            if (Math.abs(enemy.position.x - lazerPos.x) < 4 && Math.abs(enemy.position.y - lazerPos.y) < 4) {
                enemy.health -= 2;
            }
        });
    })

    return (
        <transformNode name="masterSparkTransformNode" ref={transformNodeRef} position={new Vector3(0, -0.2, 0)} {...props}>
            <plane
                name={name + 'plane'}
                scaling={new Vector3(50, 50, 50)}
                ref={circle1Ref}
            >
                <standardMaterial useAlphaFromDiffuseTexture disableLighting={true} diffuseTexture={runeEmpty} emissiveColor={new Color3(1, 0, 0)} name={name + 'circle1Mat'} />
            </plane>
            <plane
                name={name + 'plane'}
                scaling={new Vector3(50, 50, 50)}
                ref={circle2Ref}
            >
                <standardMaterial useAlphaFromDiffuseTexture disableLighting={true} diffuseTexture={runeEmpty} emissiveColor={new Color3(1, 1, 0)} name={name + 'circle2Mat'} />
            </plane>
            <plane
                name={name + 'plane'}
                scaling={new Vector3(50, 50, 50)}
                ref={circle3Ref}
            >
                <standardMaterial useAlphaFromDiffuseTexture disableLighting={true} diffuseTexture={runeEmpty} emissiveColor={new Color3(0, 0, 1)} name={name + 'circle3Mat'} />
            </plane>
            <plane
                name={name + 'plane'}
                scaling={new Vector3(50, 50, 50)}
                ref={circle4Ref}
            >
                <standardMaterial useAlphaFromDiffuseTexture disableLighting={true} diffuseTexture={runeEmpty} emissiveColor={new Color3(0, 1, 0)} name={name + 'circle4Mat'} />
            </plane>
            <transformNode name="masterSparkBeamTransformNode" ref={masterSparkTransformNode}>
                <MasterSparkBeam ref={masterSparkRef} scaling={initialBeamScaling} />
            </transformNode>
        </transformNode>
    )
}
