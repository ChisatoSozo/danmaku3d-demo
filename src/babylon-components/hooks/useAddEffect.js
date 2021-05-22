import { useContext } from 'react';
import { EffectsContext } from '../gameLogic/GeneralContainer';

export const useAddEffect = () => {
    return useContext(EffectsContext);
};
