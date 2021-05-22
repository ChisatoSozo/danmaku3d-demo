import { DynamicTexture, Vector3 } from '@babylonjs/core';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useBeforeRender } from 'react-babylonjs';
import { useKeydown } from '../../hooks/useKeydown';
import { useWindowSize } from '../../hooks/useWindowSize';
import { choiceSound, selectSound } from '../../sounds/SFX';
import { textOnCtx } from '../BabylonUtils';
import { useName } from '../hooks/useName';

export const IngameMenu = ({ title, optionsMap }) => {
    const name = useName()
    const transformNodeRef = useRef();
    const [selectedOption, setSelectedOption] = useState(0)
    const optionKeys = useMemo(() => Object.keys(optionsMap), [optionsMap]);
    const textures = useMemo(
        () =>
            optionKeys.map((key, i) => {
                const texture = new DynamicTexture(name + i, {
                    width: 1024,
                    height: 128,
                })
                texture.hasAlpha = true;
                return texture;
            }),
        [name, optionKeys]
    );

    const backgroundTexture = useMemo(() => {
        const texture = new DynamicTexture(name + "background", {
            width: 1024,
            height: 640,
        })
        texture.hasAlpha = true;
        const ctx = texture.getContext();
        ctx.fillStyle = '#000000EE';
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        textOnCtx(ctx, title, 0.25, 0.5, 0.3, 'black', 'white', undefined, true);
        texture.update();
        return texture;
    }, [name, title])

    useEffect(() => {
        const keys = optionKeys;
        textures.forEach((texture, i) => {
            const ctx = texture.getContext();
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            textOnCtx(ctx, keys[i], 0.75, 0.3, 0.9, i === selectedOption ? 'white' : 'black', i === selectedOption ? 'black' : 'white');
            if (i === selectedOption) {
                textOnCtx(ctx, "*", 1, 0.15, 0.9, 'red');
            }
            texture.update();
        })
    }, [optionKeys, selectedOption, textures])

    useKeydown("SHOOT", () => {
        selectSound.play();
        optionsMap[optionKeys[selectedOption]]();
    })

    const windowSize = useWindowSize()

    useBeforeRender((scene) => {
        const result = scene.pick(windowSize.width / 2, windowSize.height / 2, mesh => mesh.name.startsWith(name))
        if (result.hit) {
            const num = parseFloat(result.pickedMesh.name.replace(name, ''));
            if (num !== selectedOption) {
                choiceSound.play();
                setSelectedOption(num)
            }
        }
    })

    return (
        <transformNode name={name} position={new Vector3(0, 4, -1.0)} ref={transformNodeRef}>
            <plane name={"BackgroundPlane" + name} position={new Vector3(0, 1.1, 1.0)} width={8} height={5} renderingGroupId={1}>
                <standardMaterial
                    disableLighting={true}
                    useAlphaFromDiffuseTexture
                    name={name + "material"}
                    diffuseTexture={backgroundTexture}
                    emissiveTexture={backgroundTexture}
                />
            </plane>
            {optionKeys.map((key, i) =>
                <plane name={name + i} key={key} position={new Vector3(0, 1 - i * 1.2, 0)} width={8} height={1} renderingGroupId={1}>
                    <standardMaterial
                        disableLighting={true}
                        useAlphaFromDiffuseTexture
                        name={name + "material"}
                        diffuseTexture={textures[i]}
                        emissiveTexture={textures[i]}
                    />
                </plane>
            )}
        </transformNode>
    );
}
