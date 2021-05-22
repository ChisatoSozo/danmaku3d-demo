import { times } from 'lodash'
import {createRef, useCallback, useState} from 'react'

export const useMinions = (num) => {
    const [minions, setMinions] = useState(times(num, () => ({
        ref: createRef(),
        inScene: false
    })))

    const setInScene = useCallback((indicies, inScene) => {
        setMinions(minions => {
            const newMinions = [...minions];

            if(!Array.isArray(indicies)) indicies = [indicies];
            indicies.forEach(index => {
                newMinions[index].inScene = inScene;
            })
            
            return newMinions;
        })
    }, [])

    return {minions, setInScene};
}
