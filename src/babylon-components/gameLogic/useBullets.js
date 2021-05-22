import { useCallback, useContext } from 'react';
import { useBeforeRender, useScene } from 'react-babylonjs';
import { globals, GlobalsContext, resetValue } from '../../components/GlobalsContainer';
import { enemyDamage, itemGet, playerDeath, playerGraze } from '../../sounds/SFX';
import { MAX_ENEMIES, PLAYER_INVULNERABLE_COOLDOWN } from '../../utils/Constants';
import { makeBulletBehaviour } from '../bullets/behaviours';
import { BULLET_TYPE } from '../bullets/behaviours/EnemyBulletBehaviour';
import { BulletGroup } from '../bullets/BulletGroup';
import { convertEnemyBulletCollisions, convertPlayerBulletCollisions, prepareBulletInstruction } from '../bullets/BulletUtils';
import { makeEndTimings } from '../bullets/endTimings';
import { makeBulletMaterial } from '../bullets/materials';
import { makeBulletMesh } from '../bullets/meshes';
import { makeBulletPattern } from '../bullets/patterns';
import { makeBulletSound } from '../bullets/sounds';
import { makeName } from '../hooks/useName';
import { allBullets, globalActorRefs, killEnemy } from './StaticRefs';
import { useMeshPool } from './useMeshPool';

let playHitSound = false;
let framesSincePlayHit = 0;
export const playerInvulnerable = {
    current: false
}

export const useBullets = (assets, environmentCollision, addEffect, isDead, setIsDead) => {
    const scene = useScene();
    const { getMesh, releaseMesh } = useMeshPool()
    const { setGlobal } = useContext(GlobalsContext);

    const disposeSingle = useCallback((id) => {
        allBullets[id].dispose();
        delete allBullets[id];
    }, []);

    const dispose = useCallback((ids) => {
        ids.forEach((id) => {
            allBullets[id].dispose();
            delete allBullets[id];
        });
    }, []);

    const clearAllBullets = useCallback(() => {
        Object.keys(allBullets).forEach((bulletGroupIndex) => {
            const bulletGroup = allBullets[bulletGroupIndex];
            if (bulletGroup.behaviour.isEnemyBullet && bulletGroup.behaviour.bulletType === BULLET_TYPE.BULLET) {
                bulletGroup.lifespan = 0;
            }
        });
    }, [])

    const preComputeBulletGroup = useCallback((instruction) => {
        const preparedInstruction = prepareBulletInstruction(instruction);
        if (!preparedInstruction || preparedInstruction.patternOptions.towardsPlayer || preparedInstruction.patternOptions.disablePrecomputation) return;
        const { positions, velocities, timings } = makeBulletPattern(preparedInstruction.patternOptions, false, scene);
        const endTimings = makeEndTimings(preparedInstruction.endTimings, preparedInstruction.lifespan, timings.length, scene);
        return { positions, velocities, timings, endTimings, instruciton: preparedInstruction }
    }, [scene])

    const addBulletGroup = useCallback(
        (parent, instruction, sourceBulletId = false, supressNotPrecomputedWarning = false) => {
            if (!parent) throw new Error('parent not ready!');

            const preparedInstruction = prepareBulletInstruction(instruction);
            if (!preparedInstruction) return;
            if (sourceBulletId) preparedInstruction.patternOptions.sourceBulletId = sourceBulletId;

            const { positions, velocities, timings, uid } = makeBulletPattern(preparedInstruction.patternOptions, parent, scene, supressNotPrecomputedWarning);
            const material = makeBulletMaterial(preparedInstruction.materialOptions, parent, assets, scene);
            const { mesh, radius } = makeBulletMesh(preparedInstruction.meshOptions, assets, getMesh);
            const behaviour = makeBulletBehaviour(preparedInstruction.behaviourOptions, environmentCollision, radius, parent);
            const endTimings = makeEndTimings(preparedInstruction.endTimings, preparedInstruction.lifespan, timings.length, scene)
            const sounds = preparedInstruction.soundOptions && !preparedInstruction.soundOptions.mute && makeBulletSound(preparedInstruction.soundOptions, timings);

            mesh.makeInstances(timings.length);
            mesh.material = material;

            const reliesOnParent = preparedInstruction.behaviourOptions.reliesOnParent;
            const disableWarning = preparedInstruction.behaviourOptions.disableWarning || false;

            behaviour.init(material, positions, velocities, timings, endTimings, reliesOnParent, disableWarning, uid, scene);

            const { lifespan } = preparedInstruction;
            const timeSinceStart = 0;

            const bulletGroup = new BulletGroup({ material, mesh, behaviour, sounds, positions, velocities, timings, endTimings, lifespan, timeSinceStart, uid, instruciton: preparedInstruction, releaseMesh });

            const newID = makeName('bulletGroup');
            allBullets[newID] = bulletGroup;
            return newID;
        },
        [scene, assets, getMesh, environmentCollision, releaseMesh]
    );

    useBeforeRender(() => {
        if (isDead || scene.paused) return;

        //Collisions
        if (playHitSound && framesSincePlayHit % 6 === 0) {
            enemyDamage.play();
            playHitSound = false;
            framesSincePlayHit = 0;
        }
        framesSincePlayHit++;

        Object.values(allBullets).forEach((bulletGroup) => {
            if (bulletGroup.behaviour.isPlayerBullet) {
                bulletGroup.behaviour.diffSystem.collisionResult.readPixels().then((buffer) => {
                    const collisions = convertPlayerBulletCollisions(buffer);
                    collisions.forEach((collision) => {
                        if (collision.collisionID >= MAX_ENEMIES && collision.collisionID < MAX_ENEMIES * 2) {
                            const enemyID = collision.collisionID - MAX_ENEMIES;
                            globalActorRefs.enemies[enemyID].health -= bulletGroup.behaviour.bulletValue;
                            playHitSound = true;
                            if (globalActorRefs.enemies[enemyID]) {
                                setGlobal('SCORE', globals.SCORE + 10);
                                addEffect(collision.hit, {
                                    type: 'particles',
                                    name: 'hit'
                                });
                            }
                        }
                    });
                });
            } else {
                bulletGroup.behaviour.diffSystem.collisionResult.readPixels().then((buffer) => {
                    const collisions = convertEnemyBulletCollisions(buffer);
                    if (collisions.length > 0) {
                        const collision = collisions[0];
                        if (collision.point) {
                            setGlobal('POINT', globals.POINT + collision.point / 2);
                            setGlobal('SCORE', globals.SCORE + 50000 * (collision.point / 2));
                            itemGet.play();
                        }
                        if (collision.power) {
                            if (globals.POWER === 120) {
                                setGlobal('SCORE', globals.SCORE + 50000 * (collision.point / 2));
                            }
                            else {
                                setGlobal('POWER', Math.min(globals.POWER + collision.power / 2, 120));
                            }
                            itemGet.play();
                        }
                        if (collision.player) {
                            if (!playerInvulnerable.current) {
                                setGlobal('PLAYER', globals.PLAYER - 1);
                                resetValue("BOMB")
                                playerInvulnerable.current = true;
                                window.setTimeout(() => {
                                    playerInvulnerable.current = false;
                                }, PLAYER_INVULNERABLE_COOLDOWN * 1000)
                                playerDeath.play()

                                if (globals.PLAYER === 0) {
                                    window.setTimeout(() => setIsDead(true), 300)
                                }
                            }
                        }
                        if (collision.graze) {
                            setGlobal('GRAZE', globals.GRAZE + collision.graze / 2);
                            setGlobal('SCORE', globals.SCORE + 2000 * (collision.graze / 2));
                            playerGraze.play()
                        }
                    }
                });
            }
        });

        globalActorRefs.enemies.forEach(enemy => {
            if (enemy.dead) return;
            if (enemy.health <= 0) {
                killEnemy(enemy.id);
            }
        })

        //Lifespans
        if (scene.paused) return;
        const deltaS = scene.paused ? 0 : scene.getEngine().getDeltaTime() / 1000;

        const toRemove = [];

        Object.keys(allBullets).forEach((bulletGroupIndex) => {
            const bulletGroup = allBullets[bulletGroupIndex];
            bulletGroup.timeSinceStart += deltaS;
            if (bulletGroup.timeSinceStart > bulletGroup.lifespan) {
                toRemove.push(bulletGroupIndex);
            } else {
                bulletGroup.behaviour.update(deltaS);
                if (bulletGroup.sounds)
                    bulletGroup.sounds.update(deltaS);
            }
        });

        if (toRemove.length > 0) dispose(toRemove);

        globalActorRefs.enemies.forEach((enemy, i) => {
            const offset = i * 3;
            globalActorRefs.enemyPositionBuffer[offset + 0] = enemy.position.x;
            globalActorRefs.enemyPositionBuffer[offset + 1] = enemy.position.y;
            globalActorRefs.enemyPositionBuffer[offset + 2] = enemy.position.z;
            globalActorRefs.enemyRadiiBuffer[i] = enemy.radius;
        });

        globalActorRefs.bombs.forEach((bomb, i) => {
            const offset = i * 3;
            globalActorRefs.bombPositionBuffer[offset + 0] = bomb.position.x;
            globalActorRefs.bombPositionBuffer[offset + 1] = bomb.position.y;
            globalActorRefs.bombPositionBuffer[offset + 2] = bomb.position.z;
            globalActorRefs.bombRadiiBuffer[i] = bomb.radius;
        });
    });

    return { disposeSingle, dispose, addBulletGroup, clearAllBullets, preComputeBulletGroup, isDead };
};
