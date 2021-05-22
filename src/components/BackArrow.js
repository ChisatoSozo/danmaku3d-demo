import { makeStyles } from '@material-ui/core';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router';
import { choiceSound, selectSound } from '../sounds/SFX';

const useStyles = makeStyles({
    arrow: {
        cursor: 'pointer',
        "&:hover": {
            color: 'white',
            WebkitTextStrokeColor: 'black',
        }
    }
});

export const BackArrow = ({ back }) => {
    const history = useHistory();
    const classes = useStyles()

    const handleMouseOver = useCallback(() => {
        choiceSound.play();
    }, []);

    const handleClick = useCallback(() => {
        history.push(back)
        selectSound.play();
    }, [back, history]);

    return (
        <span className={classes.arrow} onPointerOver={handleMouseOver} onClick={handleClick}>
            ←
        </span >
    )
}
