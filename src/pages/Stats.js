import { Box, withStyles } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import MuiTableCell from "@material-ui/core/TableCell";
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import React from 'react';
import { useHistory } from 'react-router';
import { useBack } from '../hooks/useBack';
import { useKeydownMenu } from '../hooks/useKeydown';
import { useLS } from '../hooks/useLS';

const STATS_KEYS = [
    "HIGHEST_SCORE",
    "DIFFICULTY_LEVEL",
    "CONTINUES_USED",
    "DEATHS",
    "BOMBS_USED",
    "FRAMES_DROPPED",
]

const TableCell = withStyles({
    root: {
        borderBottom: "none"
    }
})(MuiTableCell);

export const Stats = () => {
    useBack('/menu');
    const history = useHistory();
    useKeydownMenu("ENTER", () => {
        history.push("/")
    })
    const ls = useLS()


    return <Box>
        <span style={{ fontSize: "8vh" }}>
            Your Stats
        </span>
        <Table style={{ width: "80vh" }}>
            <TableHead>
                <TableRow>
                    <TableCell></TableCell>
                    <TableCell align="right"></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {STATS_KEYS.map(key => {
                    const stat = ls(key);
                    return <TableRow key={key}>
                        <TableCell component="th" scope="row">
                            {key}
                        </TableCell>
                        <TableCell align="right">{stat}</TableCell>
                    </TableRow>
                })}
            </TableBody>
        </Table>
    </Box>
};
