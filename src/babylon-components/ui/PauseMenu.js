import React, { useContext, useMemo } from 'react';
import { PauseContext } from '../gameLogic/GeneralContainer';
import { IngameMenu } from './IngameMenu';

export const PauseMenu = () => {
    const { setPaused } = useContext(PauseContext);
    const optionsMap = useMemo(() => ({
        Resume: () => setPaused(false),
        Quit: () => window.location.href = '/'
    }), [setPaused])

    return <IngameMenu title="Paused" optionsMap={optionsMap} />
};
