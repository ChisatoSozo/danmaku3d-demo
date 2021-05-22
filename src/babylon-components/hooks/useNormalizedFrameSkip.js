import { useMemo, useState } from 'react';
import { useBeforeRender, useEngine } from 'react-babylonjs';

const mode = function mode(arr) {
    return arr.reduce(
        function (current, item) {
            var val = (current.numMapping[item] = (current.numMapping[item] || 0) + 1);
            if (val > current.greatestFreq) {
                current.greatestFreq = val;
                current.mode = item;
            }
            return current;
        },
        { mode: null, greatestFreq: -Infinity, numMapping: {} }
    ).mode;
};

export const useNormalizedFrameSkip = (frameSkipInit) => {
    const [frameSkip, setFrameSkip] = useState(frameSkipInit);
    const fpsHistory = useMemo(() => [], []);
    const engine = useEngine();

    useBeforeRender(() => {
        const fps = engine.getFps();
        fpsHistory.push(fps);
        if (fpsHistory.length > 10) {
            fpsHistory.shift();
        }
        const fpsMode = mode(fpsHistory);

        const newFrameSkip = Math.round((frameSkipInit / 60) * fpsMode);

        if (newFrameSkip !== frameSkip) {
            setFrameSkip(newFrameSkip);
        }
    });

    return frameSkip;
};
