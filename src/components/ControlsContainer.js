import React, { useCallback, useEffect, useState } from 'react';
import { useBeforeRender } from 'react-babylonjs';

export const ControlsContext = React.createContext();

const defaultKeyMap = {
    27: 'MENU',
    13: 'ENTER',
    40: 'DOWN', //Down arrow
    83: 'DOWN', //s
    38: 'UP', //Up arrow
    87: 'UP', //w
    37: 'LEFT', //left arrow
    65: 'LEFT', //a
    39: 'RIGHT', //right arrow
    68: 'RIGHT', //d
    16: 'SLOW', //shift
    32: 'BOMB', //space
    1: 'SHOOT', //click
    80: 'DIALOGUE', //p
}

const makeDefaultDownKeyMap = () => {
    const keys = new Set(Object.values(defaultKeyMap))
    const downKeyMap = {};
    keys.forEach(key => {
        downKeyMap[key] = false;
    })
    return downKeyMap;
}

export const keyObject = {
    metaDownKeys: makeDefaultDownKeyMap(),
    disabledMap: {}
}

export const ControlsContainer = ({ children, outsideOfRenderer }) => {
    const [downKeys, setDownKeys] = useState([]);
    const [typing, setTyping] = useState(false);
    const [disabled, setDisabled] = useState(false);

    const [keyMap, setKeyMap] = useState({
        27: 'MENU',
        13: 'ENTER',
        40: 'DOWN', //Down arrow
        83: 'DOWN', //s
        38: 'UP', //Up arrow
        87: 'UP', //w
        37: 'LEFT', //left arrow
        65: 'LEFT', //a
        39: 'RIGHT', //right arrow
        68: 'RIGHT', //d
        16: 'SLOW', //shift
        32: 'BOMB', //space
        1: 'SHOOT', //click
    });

    const keyDownHandler = useCallback(
        (event) => {
            if (disabled) return;
            if (!(event.which in keyMap)) {
                return;
            }
            const key = keyMap[event.which];

            if (typing && !['ENTER', 'MENU'].includes(key)) return;

            if (keyObject.metaDownKeys[key]) return;
            if (keyObject.disabledMap[key]) return;

            const newMetaDownKeys = { ...keyObject.metaDownKeys };
            newMetaDownKeys[key] = true;
            keyObject.metaDownKeys = newMetaDownKeys;
        },
        [disabled, keyMap, typing]
    );

    const keyUpHandler = useCallback(
        (event) => {
            if (disabled) return;
            if (!(event.which in keyMap)) {
                return;
            }

            const key = keyMap[event.which];

            if (typing && !['ENTER', 'MENU'].includes(key)) return;

            if (!keyObject.metaDownKeys[key]) return;

            const newMetaDownKeys = { ...keyObject.metaDownKeys };
            newMetaDownKeys[key] = false;
            keyObject.metaDownKeys = newMetaDownKeys;
        },
        [disabled, keyMap, typing]
    );

    const keySync = useCallback(() => {
        setDownKeys(keyObject.metaDownKeys);
    }, [setDownKeys]);

    const disableControl = useCallback((control) => {
        keyObject.disabledMap[control] = true;
    }, [])

    const enableControl = useCallback((control) => {
        delete keyObject.disabledMap[control];
    }, [])

    useEffect(() => {
        if (!outsideOfRenderer) return;

        const timerID = window.setInterval(keySync, 16);

        return () => {
            window.clearInterval(timerID);
        };
    }, [outsideOfRenderer, keySync]);

    useBeforeRender(() => {
        setDownKeys(keyObject.metaDownKeys);
    });

    return (
        <ControlsContext.Provider
            value={{
                keyMap,
                setKeyMap,
                downKeys,
                keyDownHandler,
                keyUpHandler,
                disableControl,
                enableControl,
                setTyping,
                setDisabled
            }}
        >
            {children}
        </ControlsContext.Provider>
    );
};
