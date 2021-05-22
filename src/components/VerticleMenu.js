import { Box, List, ListItem, makeStyles } from '@material-ui/core';
import { isFunction } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { choiceSound, selectSound } from '../sounds/SFX';
import { SETTINGS, SET_SETTINGS } from '../utils/Settings';
import { SlideBox } from "./SlideBox";

const useStyles = makeStyles({
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
        left: '115vw',
    },
    optionsPos2: {
        left: '70vw',
    },
    arrayChoice: {
        padding: '10px',
        cursor: 'pointer',
        '&:hover': {
            color: "#333333"
        }
    },
});

export const VerticleMenuSingle = ({ active, selected, menuKey, menuValue, slanted, index, setSelectedItem }) => {
    const styleAddin = selected
        ? {
            color: 'white',
            WebkitTextStrokeColor: 'black',
        }
        : {};

    const handleClick = useCallback(() => {
        if (!active) return;
        if (!isFunction(menuValue)) return;
        menuValue();
        selectSound.play();
    }, [active, menuValue]);

    const handleMouseOver = useCallback(() => {
        setSelectedItem(index)
        choiceSound.play();
    }, [index, setSelectedItem]);

    return (
        <ListItem
            style={{
                left: slanted ? -index * 3 + 'vh' : 0,
                transition: 'left 2s',
                cursor: 'pointer',

                ...styleAddin,
            }}
            key={menuKey}
            onPointerOver={handleMouseOver}
            onClick={handleClick}
        >
            {menuKey}
        </ListItem>
    );
};

export const MenuArrayItem = ({ selected, setSelectedItem, setChoice, index, value }) => {

    const styleAddin = selected
        ? {
            color: 'white',
            WebkitTextStrokeColor: 'black',
        }
        : {};

    const classes = useStyles();

    const handleClick = useCallback(() => {
        setChoice(value)
        selectSound.play();
    }, [setChoice, value]);

    const handleMouseOver = useCallback(() => {
        setSelectedItem(index)
        choiceSound.play();
    }, [index, setSelectedItem]);


    return (
        <span onClick={handleClick} onPointerOver={handleMouseOver} className={classes.arrayChoice} style={{ ...styleAddin }}>
            {value}
        </span>
    );
}

export const VerticleMenuArray = ({ selected, menuKey, menuValue, slanted, index, setSelectedItem }) => {
    const styleAddin = selected
        ? {
            color: 'white',
            WebkitTextStrokeColor: 'black',
        }
        : {};

    const [choice, setChoice] = useState(SETTINGS[menuKey.toUpperCase()]);

    useEffect(() => {
        SETTINGS[menuKey.toUpperCase()] = choice;
        SET_SETTINGS();
    }, [choice, menuKey]);

    const arrayIndex = menuValue.indexOf(choice);

    return (
        <ListItem
            style={{
                left: slanted ? -index * 3 + 'vh' : 0,
                transition: 'left 2s',
            }}
            key={menuKey}
        >
            <Box display="flex" position="relative" left="-250px">
                <span style={{ ...styleAddin }}>{menuKey}</span>
                <Box position="absolute" left="350px">
                    {menuValue.map((val, i) =>
                        <MenuArrayItem
                            key={val}
                            selected={arrayIndex === i}
                            index={index}
                            setSelectedItem={setSelectedItem}
                            setChoice={setChoice}
                            value={val}
                            styleAddin={styleAddin}
                        />)}
                </Box>
            </Box>
        </ListItem>
    );
};

export const VerticleMenu = ({ menuMap, active = true, slanted = false, back = false, wide = false, medium = false }) => {

    const history = useHistory();
    const menuMapProc = back ? {
        ...menuMap,

        "←": () => history.push(back)
    } : menuMap;

    const menuKeys = Object.keys(menuMapProc);
    const [selectedItem, setSelectedItem] = useState(0);


    return (
        <SlideBox wide={wide} medium={medium} active={active}>
            <List>
                {menuKeys.map((menuKey, i) => {
                    const menuValue = menuMapProc[menuKey];
                    const menuItemProps = {
                        setSelectedItem,
                        selected: i === selectedItem,
                        menuKey: menuKey,
                        slanted: slanted,
                        index: i,
                        menuValue: menuValue,
                        active
                    };

                    if (isFunction(menuValue)) return <VerticleMenuSingle key={i} {...menuItemProps} />;
                    if (Array.isArray(menuValue)) return <VerticleMenuArray key={i} {...menuItemProps} />;
                    return false;
                })}
            </List>
        </SlideBox>
    );
};
