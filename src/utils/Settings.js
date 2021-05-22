import ls from 'local-storage';
import Music from '../sounds/Music';
import * as SOUNDS from '../sounds/SFX';

export const SETTINGS = ls('SETTINGS')
    ? JSON.parse(ls('SETTINGS'))
    : {
        PLAYER: 3,
        BOMB: 2,

        MUSIC: 'ON',
        SFX: 'ON',
        QUALITY: "HI"
    };

export const SET_SETTINGS = () => {
    if (SETTINGS.MUSIC === 'ON') {
        Music.play();
    }

    if (SETTINGS.MUSIC === 'OFF') {
        Music.stop();
    }

    if (SETTINGS.SFX === 'OFF') {
        for (let sound in SOUNDS) {
            if (SOUNDS[sound].stop) SOUNDS[sound].stop();
        }
    }

    ls('SETTINGS', JSON.stringify(SETTINGS));
};
