import { Vector3 } from '@babylonjs/core';
import React, { useRef } from 'react';
import { useName } from '../hooks/useName';

export const Playground = () => {
    const transformNodeRef = useRef();
    const name = useName('playground');

    return <transformNode position={new Vector3(0, 5, 0)} name={name} ref={transformNodeRef}></transformNode>;
};
