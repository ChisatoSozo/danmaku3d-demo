import React, { useContext, useRef } from 'react';
import { Scene } from 'react-babylonjs';

export const SceneContext = React.createContext();

export const SceneContainer = ({ children, ...props }) => {
    const sceneRef = useRef();

    return (
        <SceneContext.Provider value={sceneRef.current}>
            <Scene {...props}>{children}</Scene>
        </SceneContext.Provider>
    );
};

export const useScene = () => {
    return useContext(SceneContext);
};
