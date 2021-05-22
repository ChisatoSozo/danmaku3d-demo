import { Animation, Color3, StandardMaterial, Vector3 } from '@babylonjs/core';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useBeforeRender, useScene } from 'react-babylonjs';
import { playerBombShoot } from '../../../../../sounds/SFX';
import { AnimationContext } from '../../../../gameLogic/GeneralContainer';
import { addBomb, globalActorRefs, removeBomb, setBombPosition, setBombRadius } from '../../../../gameLogic/StaticRefs';
import { useGlowLayer } from '../../../../gameLogic/useGlowLayer';
import { useAddEffect } from '../../../../hooks/useAddEffect';
import { useDoSequence } from '../../../../hooks/useDoSequence';
import { useName } from '../../../../hooks/useName';
import { TrailMesh } from '../../../../TrailMesh';

const initialVelocity = 4;

export const ReimuBombObject = ({ id, color, delay, ...props }) => {
    const transformNodeRef = useRef();
    const timeDelta = useRef(0);
    const scene = useScene();
    const trail = useRef();
    const thisHealthRef = useRef(200);
    const name = useName('bombObject');
    const { registerAnimation } = useContext(AnimationContext);
    const glowLayer = useGlowLayer();
    const addEffect = useAddEffect()

    const [active, setActive] = useState(true);

    useEffect(() => {
        addBomb(id, transformNodeRef.current.getAbsolutePosition(), transformNodeRef.current.scaling.x / 2)

        return () => {
            removeBomb(id)
        }
    }, [id])

    useEffect(() => {
        if (!active) {
            removeBomb(id)
            addEffect(transformNodeRef.current, {
                type: 'particles',
                name: 'death'
            });
            if (trail.current) {
                trail.current.dispose();
            }
        }
    }, [active, addEffect, id])

    const actionsTimings = useMemo(
        () => [0, delay],
        [delay]
    );

    const actions = useMemo(
        () => [
            () => {
                registerAnimation(
                    Animation.CreateAndStartAnimation(
                        'anim',
                        transformNodeRef.current,
                        'scaling',
                        60,
                        120,
                        new Vector3(0, 0, 0),
                        new Vector3(0.2, 0.2, 0.2),
                        Animation.ANIMATIONLOOPMODE_CONSTANT
                    )
                );
            },
            () => {
                playerBombShoot.play();
                transformNodeRef.current.velocity = props.position.add(new Vector3(0, 0, 1)).normalize();
                transformNodeRef.current.firing = true;

                const position = transformNodeRef.current.getAbsolutePosition();
                transformNodeRef.current.parent = false;
                transformNodeRef.current.position = position;

                trail.current = new TrailMesh('sphereTrail', transformNodeRef.current, scene, 0.2, 100, true);
                const sourceMat = new StandardMaterial('sourceMat', scene);
                sourceMat.emissiveColor = sourceMat.diffuseColor = color;
                sourceMat.specularColor = new Color3.Black();
                sourceMat.alpha = 0.3;
                trail.current.material = sourceMat;

                glowLayer.addIncludedOnlyMesh(trail.current)

                registerAnimation(
                    Animation.CreateAndStartAnimation(
                        'anim',
                        transformNodeRef.current,
                        'scaling',
                        60,
                        60,
                        new Vector3(0.2, 0.2, 0.2),
                        new Vector3(5, 5, 5),
                        Animation.ANIMATIONLOOPMODE_CONSTANT
                    )
                );
            },
        ],
        [color, glowLayer, props.position, registerAnimation, scene]
    );

    useDoSequence(true, transformNodeRef, actionsTimings, actions);

    useEffect(() => {
        const camera = scene.activeCamera;
        const sphereMesh = transformNodeRef.current;
        glowLayer.addIncludedOnlyMesh(sphereMesh)

        return () => {
            glowLayer.removeIncludedOnlyMesh(trail.current)
            glowLayer.removeIncludedOnlyMesh(sphereMesh)
            trail.current.dispose();
            camera.position.x = 0;
            camera.position.y = 0;
        };
    }, [glowLayer, scene.activeCamera]);

    useBeforeRender((scene) => {
        if (!transformNodeRef.current) return;
        if (!transformNodeRef.current.firing) return;

        const camera = scene.activeCamera;
        const deltaS = scene.paused ? 0 : scene.getEngine().getDeltaTime() / 1000;
        timeDelta.current += deltaS;

        if (timeDelta.current < 2) {
            camera.position.x = (Math.random() - 0.5) * 0.03;
            camera.position.y = (Math.random() - 0.5) * 0.03;
        } else {
            camera.position.x = 0;
            camera.position.y = 0;
        }

        if (!active) return;

        const thisPosition = transformNodeRef.current.getAbsolutePosition();
        let closestEnemyPosition;
        let closestEnemyDistance = Number.MAX_SAFE_INTEGER;
        let closestEnemyID;

        globalActorRefs.enemies.forEach((enemy, id) => {
            if (enemy.x < -500) return;
            const distance = Vector3.Distance(enemy.position, thisPosition);
            if (distance < closestEnemyDistance) {
                closestEnemyDistance = distance;
                closestEnemyPosition = enemy.position;
                closestEnemyID = id;
            }
        });

        if (closestEnemyDistance < 100) {
            const newVelocity = closestEnemyPosition.subtract(thisPosition);
            transformNodeRef.current.velocity = Vector3.Lerp(transformNodeRef.current.velocity, newVelocity, deltaS).normalize();
            if (closestEnemyDistance < 5 && closestEnemyID !== undefined) {
                if (thisHealthRef.current < globalActorRefs.enemies[closestEnemyID].health) {
                    globalActorRefs.enemies[closestEnemyID].health -= thisHealthRef.current;
                    thisHealthRef.current = 0;
                    setActive(false);
                }
                if (thisHealthRef.current === globalActorRefs.enemies[closestEnemyID].health) {
                    thisHealthRef.current = 0;
                    globalActorRefs.enemies[closestEnemyID].health = 0;
                    setActive(false);
                }
                if (thisHealthRef.current > globalActorRefs.enemies[closestEnemyID].health) {
                    thisHealthRef.current -= globalActorRefs.enemies[closestEnemyID].health
                    globalActorRefs.enemies[closestEnemyID].health = 0;
                }
            }
        }

        transformNodeRef.current.position.addInPlace(
            transformNodeRef.current.velocity.scale(deltaS * (initialVelocity + timeDelta.current * 16))
        );



        setBombPosition(id, transformNodeRef.current.getAbsolutePosition())
        setBombRadius(id, transformNodeRef.current.scaling.x / 2);
    });

    return (
        <transformNode name={name + 'transformNode'} scaling={new Vector3(0, 0, 0)} ref={transformNodeRef} {...props}>
            {active &&
                <sphere name={name + 'sphere'} >
                    <standardMaterial
                        name={name + 'material'}
                        alpha={0.3}
                        diffuseColor={color}
                        emissiveColor={color}
                        specularColor={new Color3(0, 0, 0)}
                    />
                </sphere>}
        </transformNode>
    );
};
