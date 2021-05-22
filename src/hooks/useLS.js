import { useContext } from 'react';
import { LSContext } from '../components/LSContainer';

export const useLS = () => {
    return useContext(LSContext).ls;
}
