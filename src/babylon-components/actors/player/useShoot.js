import { useContext, useRef } from 'react';
import { useBeforeRender } from 'react-babylonjs';
import { keyObject } from '../../../components/ControlsContainer';
import { playerShoot } from '../../../sounds/SFX';
import { UIContext } from '../../gameLogic/GeneralContainer';
import { allBullets } from '../../gameLogic/StaticRefs';
import { useNormalizedFrameSkip } from '../../hooks/useNormalizedFrameSkip';
import { useTarget } from '../../hooks/useTarget';

export const useShoot = (transformNodeRef, shotId, focused = false, BPS = 15) => {
    const shotFrame = useRef(0);
    const target = useTarget();
    const frameSkip = useNormalizedFrameSkip(Math.round(75 / BPS));
    const { activeCharacter } = useContext(UIContext)

    useBeforeRender((scene) => {
        if (!transformNodeRef.current || !shotId) return;

        shotFrame.current += 1;

        allBullets[shotId].behaviour.focused = focused;
        allBullets[shotId].behaviour.firing = false;
        allBullets[shotId].behaviour.target = target;
        const SHOOT = activeCharacter ? false : keyObject.metaDownKeys['SHOOT'];

        if (SHOOT && !scene.paused) {
            playerShoot.play();
        } else {
            playerShoot.stop();
        }

        if (shotFrame.current > frameSkip) {
            if (SHOOT && !scene.paused) {
                allBullets[shotId].behaviour.firing = true;
            }
            shotFrame.current = 0;
        }
    });
}
