
import { useMemo } from 'react';
import { useScene } from 'react-babylonjs';
import { GlowLayer } from '../GlowLayer';

export const glowLayerRef = {
    current: false
}

export const useGlowLayer = () => {
    const scene = useScene();
    const glowLayer = useMemo(() => {
        if (glowLayerRef.current) return glowLayerRef.current

        const glowLayer = new GlowLayer('glow', scene);
        glowLayer.blurKernelSize = 100;

        glowLayerRef.current = glowLayer;
        return glowLayer;
    }, [scene]);
    return glowLayer;
};
