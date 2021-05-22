import { InputBase } from "@material-ui/core";
import { useMemo } from "react";
import { useHistory } from "react-router";
import { useLS } from "./useLS";

export const useNewScores = (newName, setNewName) => {
    const ls = useLS()
    const highScores = useMemo(() => ls("HIGH_SCORES"), [ls]);
    const newScore = useMemo(() => ls("NEW_SCORE"), [ls]);
    const newHighScore = useMemo(() => highScores.some(score => score.score < newScore) ? newScore : false, [highScores, newScore])
    const history = useHistory()

    if (!newHighScore && newScore) {
        ls("NEW_SCORE", 0)
        history.push("/")
    }
    const newScores = useMemo(() => {
        if (newHighScore) {
            const scoresWithNewScore = [...highScores, {
                name: <InputBase
                    placeholder="Enter a name"
                    value={newName}
                    onChange={e => { setNewName(e.target.value) }}
                />,
                score: newHighScore
            }]
            return scoresWithNewScore.sort((a, b) => b.score - a.score).slice(0, 7);
        }
        return highScores
    }, [highScores, newHighScore, newName, setNewName])

    return newScores;
}