import { useContext } from 'react';
import { BulletsContext } from '../gameLogic/GeneralContainer';

export const useAddBulletGroup = () => {
    return useContext(BulletsContext).addBulletGroup;
};
