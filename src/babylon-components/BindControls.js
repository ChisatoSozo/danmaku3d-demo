import { useContext, useEffect } from 'react';
import { useEngine } from 'react-babylonjs';
import { ControlsContext } from '../components/ControlsContainer';

export const BindControls = () => {
    const engine = useEngine();
    const canvas = engine.getRenderingCanvas();
    const { keyDownHandler, keyUpHandler } = useContext(ControlsContext);

    useEffect(() => {
        if (!canvas) return;

        canvas.addEventListener('keyup', keyUpHandler);
        canvas.addEventListener('keydown', keyDownHandler);
        canvas.addEventListener('pointerup', keyUpHandler);
        canvas.addEventListener('pointerdown', keyDownHandler);

        return () => {
            canvas.removeEventListener('keyup', keyUpHandler);
            canvas.removeEventListener('keydown', keyDownHandler);
            canvas.addEventListener('pointerup', keyUpHandler);
            canvas.addEventListener('pointerdown', keyDownHandler);
        };
    }, [canvas, keyDownHandler, keyUpHandler]);

    return false;
};
