import { useRef, useContext, useEffect, useState } from 'react';
import { useBeforeRender } from 'react-babylonjs';
import { keyObject } from '../components/ControlsContainer';
import { ControlsContext } from '../components/ControlsContainer';

export const useKeydown = (key, onKeydown) => {

    const keyDown = useRef(keyObject.metaDownKeys[key]);

    useBeforeRender(() => {
        if (keyObject.metaDownKeys[key]) {
            if (keyDown.current === false) {
                onKeydown();
            }
            keyDown.current = true;
        } else {
            keyDown.current = false;
        }
    });
};

export const useKeyup = (key, onKeyup) => {

    const keyDown = useRef(keyObject.metaDownKeys[key]);
    useBeforeRender(() => {
        if (keyObject.metaDownKeys[key]) {
            keyDown.current = true;
        } else {
            if (keyDown.current === true) {
                onKeyup();
            }
            keyDown.current = false;
        }
    });
};

export const useKeydownMenu = (key, onKeydown) => {
    const { downKeys } = useContext(ControlsContext);
    const [keyDown, setKeyDown] = useState(downKeys[key]);

    useEffect(() => {
        if (downKeys[key]) {
            if (keyDown === false) {
                onKeydown();
            }
            setKeyDown(true);
        } else {
            setKeyDown(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [downKeys]);
};

export const useKeyupMenu = (key, onKeyup) => {
    const { downKeys } = useContext(ControlsContext);
    const [keyDown, setKeyDown] = useState(downKeys[key]);
    useEffect(() => {
        if (downKeys[key]) {
            setKeyDown(true);
        } else {
            if (keyDown === true) {
                onKeyup();
            }
            setKeyDown(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [downKeys]);
};