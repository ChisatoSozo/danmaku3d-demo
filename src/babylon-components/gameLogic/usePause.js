import { useCallback, useEffect, useState } from 'react';
import { useScene } from 'react-babylonjs';
import Music from '../../sounds/Music';

let animations = [];

export const usePause = () => {
    const [paused, setPaused] = useState(false);
    const scene = useScene();

    useEffect(() => {
        if (paused) {
            Music.pause();
            scene.paused = true;
            animations = animations.filter((animation) => {
                animation.pause();
                return (animation._runtimeAnimations[0]._maxFrame - animation._runtimeAnimations[0]._currentFrame) > 0.2;
            });
        } else {
            Music.play();
            scene.paused = false;
            animations = animations.filter((animation) => {
                animation._paused = false;
                return (animation._runtimeAnimations[0]._maxFrame - animation._runtimeAnimations[0]._currentFrame) > 0.2;
            });
        }
    }, [paused, scene]);

    const registerAnimation = useCallback((animation) => {
        animations = [animation, ...animations];
    }, []);

    const unregisterAnimation = useCallback((animation) => {
        animations = animations.filter(animationInst => animationInst !== animation);
    }, []);

    return { paused, setPaused, registerAnimation, unregisterAnimation };
};
