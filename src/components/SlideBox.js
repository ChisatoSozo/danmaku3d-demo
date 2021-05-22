import { Box, makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles({
    options: {
        position: 'absolute',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'left 2s',
        whiteSpace: 'nowrap',
        flexDirection: 'column'
    },
    optionsPos1: {
        left: props => (props.wide || props.medium) ? '145vw' : '115vw',
    },
    optionsPos2: {
        left: props => props.wide ? '40vw' : '70vw',
    },
});

export const SlideBox = ({ children, active, wide, medium }) => {
    const classes = useStyles({ wide, medium });
    const optionsPos = active ? classes.optionsPos2 : classes.optionsPos1;

    return (
        <Box className={classes.options + ' ' + optionsPos}>
            {children}
        </Box>
    )
}
