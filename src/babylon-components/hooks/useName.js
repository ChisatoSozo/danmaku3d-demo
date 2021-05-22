import { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const useName = (prefix) => {
    return useMemo(() => (prefix || '') + uuidv4(), [prefix]);
};

export const makeName = (prefix) => {
    return (prefix || '') + uuidv4();
};
