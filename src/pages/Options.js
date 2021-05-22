import React, { useMemo } from 'react';
import { VerticleMenu } from '../components/VerticleMenu';
import { useBack } from '../hooks/useBack';

export const Options = ({ active }) => {
    useBack('/menu');

    const optionsList = useMemo(
        () => ({
            Player: [1, 2, 3, 4, 5],
            Bomb: [1, 2, 3],
            MUSIC: ['ON', 'OFF'],
            SFX: ['ON', 'OFF'],
            QUALITY: ["HI", "MED", "LOW"]
        }),
        []
    );

    return <VerticleMenu active={active} slanted={active} menuMap={optionsList} medium back="/menu"></VerticleMenu>;
};
