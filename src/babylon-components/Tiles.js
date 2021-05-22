import { Vector3 } from '@babylonjs/core';
import React from 'react';
import { useName } from './hooks/useName';

export const Tiles = ({ url, width = 100, height = 100, repeatZ = 1, repeatX = 1, ...props }) => {
    const name = useName();

    return (
        <plane name={name} rotation={new Vector3(Math.PI / 2, 0, 0)} width={width * repeatZ} height={height * repeatX} {...props}>
            <standardMaterial name={name + 'mat'}>
                <texture uScale={repeatX} vScale={repeatZ} assignTo="diffuseTexture" url={url} />
            </standardMaterial>
        </plane>
    );
};
