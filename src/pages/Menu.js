import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { ControlsContext } from '../components/ControlsContainer';
import BackgroundImage from '../img/background.png';
import Music from '../sounds/Music';
import { CharacterSelect } from './CharacterSelect';
import { Controls } from './Controls';
import { DifficultySelect } from './DifficultySelect';
import { MainMenu } from './MainMenu';
import { Options } from './Options';
import { Score } from './Score';

const useStyles = makeStyles({
    container: {
        background: `url(${BackgroundImage})`,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    titlePos1: {
        left: '40vw',
    },
    titlePos2: {
        left: '10vw',
    },
    title: {
        transition: 'left 1s',
        writingMode: 'vertical-rl',
        textOrientation: 'upright',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        width: '20vw',
        height: '100vh',
        fontSize: '10vw',
        WebkitTextStrokeWidth: "4px",
    },
    title2: {
        writingMode: 'initial',
        fontSize: '10vw',
        WebkitTextStrokeWidth: "4px",
    },
    options: {
        position: 'absolute',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'left 2s',
        whiteSpace: 'nowrap',
    },
    optionsPos1: {
        left: '100vw',
    },
    optionsPos2: {
        left: '70vw',
    },
});

export const Menu = () => {
    useEffect(() => {
        Music.play('menuTheme');
    }, []);

    const classes = useStyles();

    const { keyUpHandler, keyDownHandler } = useContext(ControlsContext);
    const [handlerDiv, setHandlerDiv] = useState();
    useEffect(() => {
        if (!handlerDiv) return;
        handlerDiv.focus();
    })

    const location = useLocation()
    const history = useHistory();
    const menuOpen = useMemo(() => location.pathname.startsWith("/menu"), [location.pathname])

    const openMenu = useCallback(() => {
        if (menuOpen) return;
        history.push("/menu");
    }, [history, menuOpen]);


    useEffect(() => {
        window.setTimeout(openMenu, 600)
    }, [openMenu])

    const titlePos = menuOpen ? classes.titlePos2 : classes.titlePos1;

    return (
        <Box
            ref={(newRef) => setHandlerDiv(newRef)}
            onKeyUp={keyUpHandler}
            onKeyDown={keyDownHandler}
            onPointerUp={keyUpHandler}
            onPointerDown={keyDownHandler}
            className={classes.container}
            tabIndex={0}
        >
            <Box className={classes.title + ' ' + titlePos}>
                弾幕
                <Box className={classes.title2}>3D</Box>
            </Box>
            <MainMenu active={"/menu" === location.pathname} />
            <Options active={"/menu/options" === location.pathname} />
            <Controls active={"/menu/controls" === location.pathname} />
            <DifficultySelect active={"/menu/game/difficultySelect" === location.pathname} next={'/menu/game/characterSelect'} />
            <CharacterSelect active={"/menu/game/characterSelect" === location.pathname} back={'/menu/game/difficultySelect'} next={'/game/stage1'} />
            <Score active={"/menu/game/score" === location.pathname} />

        </Box>
    );
};
