import React, { useMemo } from 'react';
import { useHistory } from 'react-router';
import { VerticleMenu } from '../components/VerticleMenu';

export const MainMenu = ({ active }) => {
    const history = useHistory();

    const quit = () => {
        window.location.href = 'https://www.reddit.com/r/touhou';
    };

    const titleOptions = useMemo(
        () => ({
            Play: () => history.push('/menu/game/difficultySelect'),
            Option: () => history.push('/menu/options'),
            Score: () => history.push('/menu/game/score'),
            Controls: () => history.push('/menu/controls'),
            Quit: quit,
        }),
        [history]
    );


    return <VerticleMenu menuMap={titleOptions} slanted={active} active={active} />
};
