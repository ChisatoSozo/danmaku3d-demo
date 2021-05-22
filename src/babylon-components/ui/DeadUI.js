import React, { useContext, useEffect, useMemo } from 'react';
import { globals, resetValue, setGlobal } from '../../components/GlobalsContainer';
import { LSContext } from '../../components/LSContainer';
import { PauseContext } from '../gameLogic/GeneralContainer';
import { IngameMenu } from './IngameMenu';

export const DeadUI = ({ setIsDead }) => {
    const { setPaused } = useContext(PauseContext);
    const { ls } = useContext(LSContext);

    useEffect(() => {
        setPaused(true);
        return () => {
            setPaused(false);
        }
    })

    const optionsMap = useMemo(() => ({
        Yes: () => {
            setGlobal("CONTINUE", globals.CONTINUE + 1)
            setGlobal("SCORE", globals.SCORE / 2);
            resetValue("PLAYER");
            resetValue("BOMB");
            setIsDead(false);
        },
        No: () => {
            ls("NEW_SCORE", globals.SCORE)
            window.location.href = '/menu/game/score';
        }
    }), [ls, setIsDead])

    return <IngameMenu title="Try Again?" optionsMap={optionsMap} />
};
