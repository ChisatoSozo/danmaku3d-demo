import { useCallback, useContext, useEffect, useMemo } from 'react';
import { useScene } from 'react-babylonjs';
import { ControlsContext } from '../../components/ControlsContainer';
import { useKeydown } from '../../hooks/useKeydown';
import { UIContext } from '../gameLogic/GeneralContainer';
import { globalCallbacks } from '../gameLogic/StaticRefs';

export const UIExecutor = ({ currentActionList, setEpochIndex }) => {
    const actionList = useMemo(() => [...currentActionList], [currentActionList]);
    const {
        charactersInDialogue,
        setCharactersInDialogue,
        setActiveCharacter,
        setActiveCharacterEmotion,
        setActiveCharacterText,
        setStageStartQuote,
    } = useContext(UIContext);
    const { disableControl, enableControl } = useContext(ControlsContext)
    const scene = useScene()

    const doUIAction = useCallback(
        (action) => {
            switch (action.action) {
                case 'init':
                    setCharactersInDialogue(action.actors);
                    setActiveCharacter(action.actors[0]);
                    setActiveCharacterText(action.text);
                    disableControl("BOMB");
                    break;
                case 'talk':
                    setActiveCharacter(action.actor);
                    setActiveCharacterText(action.text);
                    setActiveCharacterEmotion(action.emotion || 'neutral');
                    break;
                case 'add':
                    setActiveCharacter(action.actor);
                    setActiveCharacterText(action.text);

                    const newCharactersInDialogue = [...charactersInDialogue];
                    newCharactersInDialogue.push(action.actor);
                    setCharactersInDialogue(newCharactersInDialogue);
                    break;
                case 'stageStartQuote':
                    setStageStartQuote(action.text);
                    break;
                case 'nextEpoch':
                    setActiveCharacter(false);
                    setCharactersInDialogue([]);
                    setActiveCharacterText(false);
                    setActiveCharacterEmotion(false);
                    setEpochIndex(epochIndex => epochIndex + 1);
                    enableControl("BOMB");
                    break;
                //UTILS
                case "globalCallback":
                    globalCallbacks[action.callback]();
                    break;
                default:
                    throw new Error('Unknown UI command: ' + action.action);
            }
        },
        [charactersInDialogue, disableControl, enableControl, setActiveCharacter, setActiveCharacterEmotion, setActiveCharacterText, setCharactersInDialogue, setEpochIndex, setStageStartQuote]
    );

    const nextUIAction = () => {
        if (actionList.length === 0) return;
        const action = actionList.shift();
        doUIAction(action);
    };

    useEffect(() => {
        nextUIAction();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentActionList]);

    useKeydown('SHOOT', () => {
        if (!scene.paused) {
            nextUIAction();
        }
    });

    return false;
};
