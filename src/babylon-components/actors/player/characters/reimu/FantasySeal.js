import { Color3, Vector3 } from '@babylonjs/core'
import React from 'react'
import {ReimuBombObject} from "./ReimuBombObject"

export const FantasySeal = () => {
    return (
        <>
            <ReimuBombObject
                id={0}
                color={new Color3(0, 0, 1)}
                delay={2.0}
                position={new Vector3(0.3 * Math.cos(0.897 * 0), 0.3 * Math.sin(0.897 * 0), 0)}
            />
            <ReimuBombObject
                id={1}
                color={new Color3(0, 1, 0)}
                delay={2.133}
                position={new Vector3(0.3 * Math.cos(0.897 * 1), 0.3 * Math.sin(0.897 * 1), 0)}
            />
            <ReimuBombObject
                id={2}
                color={new Color3(0, 1, 1)}
                delay={2.332}
                position={new Vector3(0.3 * Math.cos(0.897 * 2), 0.3 * Math.sin(0.897 * 2), 0)}
            />
            <ReimuBombObject
                id={3}
                color={new Color3(1, 0, 0)}
                delay={2.634}
                position={new Vector3(0.3 * Math.cos(0.897 * 3), 0.3 * Math.sin(0.897 * 3), 0)}
            />
            <ReimuBombObject
                id={4}
                color={new Color3(1, 0, 1)}
                delay={2.889}
                position={new Vector3(0.3 * Math.cos(0.897 * 4), 0.3 * Math.sin(0.897 * 4), 0)}
            />
            <ReimuBombObject
                id={5}
                color={new Color3(1, 1, 0)}
                delay={3.128}
                position={new Vector3(0.3 * Math.cos(0.897 * 5), 0.3 * Math.sin(0.897 * 5), 0)}
            />
            <ReimuBombObject
                id={6}
                color={new Color3(1, 0.5, 0)}
                delay={3.322}
                position={new Vector3(0.3 * Math.cos(0.897 * 6), 0.3 * Math.sin(0.897 * 6), 0)}
            />
        </>
    )
}
