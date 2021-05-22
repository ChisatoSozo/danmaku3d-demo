import { makeStyles, withStyles } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import MuiTableCell from "@material-ui/core/TableCell";
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { BackArrow } from '../components/BackArrow';
import { ControlsContext } from '../components/ControlsContainer';
import { SlideBox } from '../components/SlideBox';
import { useBack } from '../hooks/useBack';
import { useKeydownMenu } from '../hooks/useKeydown';
import { useLS } from '../hooks/useLS';
import { useNewScores } from '../hooks/useNewScores';
import { choiceSound, selectSound } from '../sounds/SFX';

const TableCell = withStyles({
    root: {
        borderBottom: "none",
        fontSize: "2.5vw",
        padding: "8px"
    }
})(MuiTableCell);

const ButtonCell = withStyles({
    root: {
        borderBottom: "none",
        borderTop: "1px solid black",
        fontSize: "2.5vw",
        padding: "8px",
    }
})(MuiTableCell);

const useStyles = makeStyles({
    confirm: {
        fontSize: "2.5vw",
        cursor: 'pointer',
        "&:hover": {
            color: 'white',
            WebkitTextStrokeColor: 'black',
        }
    }
})

export const Score = ({ active }) => {

    const [newName, setNewName] = useState("");
    const newScores = useNewScores(newName, setNewName);
    const { setTyping } = useContext(ControlsContext);
    const classes = useStyles();

    useEffect(() => {
        setTyping(true);

        return () => {
            setTyping(false);
        }
    }, [setTyping])

    const ls = useLS()
    useBack('/menu', () => {
        ls("NEW_SCORE", 0)
    });


    const history = useHistory();

    const handleMouseOver = useCallback(() => {
        choiceSound.play();
    }, []);

    const handleClick = useCallback(() => {
        selectSound.play();
        const scoresToSave = newScores.map(score => {
            if (typeof score.name === 'string') {
                return score
            }
            else {
                return {
                    name: newName,
                    score: score.score
                }
            }
        })

        ls("HIGH_SCORES", scoresToSave);
        ls("NEW_SCORE", 0);
        history.push("/menu")
    }, [history, ls, newName, newScores]);

    useKeydownMenu("ENTER", () => {
        if (newName)
            handleClick();
    })

    return <SlideBox wide active={active}>
        <span style={{ fontSize: "8vh" }}>
            High Scores
        </span>
        <Table style={{ width: "max(40vw, 60vh)" }}>
            <TableHead>
                <TableRow>
                    <TableCell></TableCell>
                    <TableCell align="right"></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {newScores.map((score, i) => {
                    return <TableRow key={i}>
                        <TableCell component="th" scope="row">
                            {score.name}
                        </TableCell>
                        <TableCell align="right">{score.score}</TableCell>
                    </TableRow>
                })}
                <TableRow>
                    <ButtonCell component="th" scope="row">
                        <BackArrow back="/menu" />
                    </ButtonCell>
                    <ButtonCell align="right">
                        <span onClick={handleClick} onPointerOver={handleMouseOver} className={classes.confirm}>
                            Confirm
                        </span>
                    </ButtonCell>
                </TableRow>
            </TableBody>
        </Table>
    </SlideBox>
};
