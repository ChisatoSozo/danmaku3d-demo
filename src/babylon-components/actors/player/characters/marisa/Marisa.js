import { Vector3 } from '@babylonjs/core';
import React from 'react';
import { Broomstick } from './Broomstick';

export const Marisa = () => {

    return (
        <transformNode name={'Marisa'}>
            <Broomstick position={new Vector3(0, -0.6, 0)} />
        </transformNode>
    );
};
