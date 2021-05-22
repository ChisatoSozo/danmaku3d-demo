import ls from 'local-storage';
import React, { useEffect } from 'react';
import { SETTINGS } from '../utils/Settings';

export const GlobalsContext = React.createContext();

const defaults = {
    HISCORE: 0,
    SCORE: 0,
    PLAYER: SETTINGS.PLAYER,
    BOMB: SETTINGS.BOMB,
    POWER: 0,
    GRAZE: 0,
    POINT: 0,
    CONTINUE: 0,
    character: "marisa",
    difficulty: "Easy"
};

export const loadGlobals = () => {
    Object.assign(globals, JSON.parse(ls('globals')));
};

export const resetGlobals = (forceSave = false) => {
    Object.assign(globals,
        {
            HISCORE: 0,
            SCORE: 0,
            PLAYER: SETTINGS.PLAYER,
            BOMB: SETTINGS.BOMB,
            POWER: 0,
            GRAZE: 0,
            POINT: 0,
            CONTINUE: 0
        })
    if (forceSave) ls('globals', JSON.stringify(globals));
};

export const resetValue = (value, forceSave) => {
    globals[value] = defaults[value];
    if (forceSave) ls('globals', JSON.stringify(globals));
};

export const globals = JSON.parse(ls('globals')) || { ...defaults };

export const setGlobal = (key, value, forceSave = false) => {
    globals[key] = value;
    if (forceSave) ls('globals', JSON.stringify(globals));
};

export const GlobalsContainer = ({ children }) => {


    useEffect(() => {
        const interval = window.setInterval(() => {
            ls('globals', JSON.stringify(globals));
        }, 1000);
        return () => {
            window.clearInterval(interval);
        };
    }, []);

    return <GlobalsContext.Provider value={{ setGlobal, loadGlobals, resetGlobals }}>{children}</GlobalsContext.Provider>;
};
