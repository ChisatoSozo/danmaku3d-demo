import { useCallback, useContext } from 'react';
import { bossDeathLoud, bossDeathQuiet, enemyDeath, playerBombCharge } from '../../sounds/SFX';
import { nullVector } from '../../utils/Constants';
import { makeParticleSystem } from '../effects/makeParticleSystem';
import { AssetsContext } from './GeneralContainer';

const effectSoundMap = {
    death: enemyDeath,
    chargeBombReimu: playerBombCharge,
    chargeBombMarisa: playerBombCharge,
    chargeWriggle: playerBombCharge,
    newPhaseWriggle: bossDeathQuiet,
    wriggleDeath: bossDeathLoud
}

const effectPlayingMap = {}

export const useEffects = (assets) => {
    const backupAssets = useContext(AssetsContext);
    if (!assets) assets = backupAssets;

    const addEffect = useCallback((emitter, effectOptions) => {
        switch (effectOptions.type) {
            case 'particles':
                const particleSystem = makeParticleSystem(assets, effectOptions.name + "Particles", emitter);

                if (!effectPlayingMap[effectOptions.name]) effectPlayingMap[effectOptions.name] = 0
                effectPlayingMap[effectOptions.name]++;

                const sound = effectSoundMap[effectOptions.name];
                if (sound) sound.play();

                window.setTimeout(() => {
                    effectPlayingMap[effectOptions.name]--
                    if (effectPlayingMap[effectOptions.name] === 0) particleSystem.emitter = nullVector;
                }, effectOptions.duration || 100);
                break;
            default:
                throw new Error('Unknown effect type' + effectOptions.type);
        }
    }, [assets]);

    return addEffect;
};
