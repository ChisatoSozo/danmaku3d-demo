import React, { useCallback, useContext, useMemo } from 'react';
import { useHistory } from 'react-router';
import { GlobalsContext } from '../components/GlobalsContainer';
import { VerticleMenu } from '../components/VerticleMenu';
import { useBack } from '../hooks/useBack';

export const DifficultySelect = ({ next, active }) => {
    const history = useHistory();
    const { setGlobal } = useContext(GlobalsContext);
    useBack('/menu');

    const choose = useCallback(
        (difficulty) => {
            setGlobal('difficulty', difficulty);
            history.push(next);
        },
        [history, setGlobal, next]
    );

    const difficultyOptions = useMemo(
        () => ({
            Easy: () => choose('Easy'),
            Normal: () => choose('Normal'),
            Hard: () => choose('Hard'),
            Lunatic: () => choose('Lunatic'),
        }),
        [choose]
    );

    return <VerticleMenu active={active} slanted={active} menuMap={difficultyOptions} back="/menu"></VerticleMenu>;
};
