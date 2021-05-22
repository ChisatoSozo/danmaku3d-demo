import { useContext } from 'react';
import { TargetContext } from '../gameLogic/GeneralContainer';

export const useTarget = () => {
    return useContext(TargetContext);
};
