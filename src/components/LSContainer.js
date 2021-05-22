import localstorage from 'local-storage';
import { max } from 'lodash';
import React, { useCallback } from 'react';
import { DEV_RESET_LS } from '../utils/Constants';

export const LSContext = React.createContext();

export const LS = {
    ///STATS
    HIGHEST_SCORE: 10000,
    DIFFICULTY_LEVEL: "Lunatic",
    CONTINUES_USED: 0,
    DEATHS: 0,
    BOMBS_USED: 0,
    FRAMES_DROPPED: 0,

    NEW_SCORE: 0,
    HIGH_SCORES: [
        {
            name: "--------",
            score: 10000
        },
        {
            name: "--------",
            score: 9000
        },
        {
            name: "--------",
            score: 8000
        },
        {
            name: "--------",
            score: 7000
        },
        {
            name: "--------",
            score: 6000
        },
        {
            name: "--------",
            score: 5000
        },
        {
            name: "--------",
            score: 4000
        }
    ],
}

const calculateLS = (inLS) => {
    inLS.HIGHEST_SCORE = max(inLS.HIGH_SCORES.map(score => score.score));
    return inLS
}

if (DEV_RESET_LS) {
    localstorage("LS", JSON.stringify(LS))
}

export const LSContainer = ({ children }) => {
    const ls = useCallback((key, value) => {
        let outLS = Object.assign(LS, JSON.parse(localstorage("LS")));
        outLS = calculateLS(outLS);

        if (value === undefined) {
            return outLS[key];
        }

        outLS = { ...outLS };
        outLS[key] = value;
        localstorage("LS", JSON.stringify(outLS))
    }, []);

    return <LSContext.Provider value={{ ls }}>{children}</LSContext.Provider>
}
