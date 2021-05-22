import { useCallback, useState } from 'react';
import { determineOrder } from '../../utils/Utils';

export const useUI = (isDead) => {
    const [charactersInDialogue, setCharactersInDialogue] = useState([]);
    const [activeCharacter, setActiveCharacter] = useState();
    const [activeCharacterEmotion, setActiveCharacterEmotion] = useState('neutral');
    const [activeCharacterText, setActiveCharacterText] = useState();
    const [stageStartQuote, setStageStartQuote] = useState();
    const [bossUI, _setBossUI] = useState();
    const [spellCardUI, setSpellCardUI] = useState();

    const setBossUI = useCallback((bossUIProps) => {
        if (!bossUIProps) {
            _setBossUI();
            return;
        }

        bossUIProps.lives.forEach(life => {
            if (life.spellCards.length !== 1 && determineOrder(life.spellCards) !== 'descending') {
                throw new Error('spell cards health for boss UI must be in descending order');
            }
        })
        _setBossUI(bossUIProps)
    }, [])

    return {
        charactersInDialogue,
        setCharactersInDialogue,
        activeCharacter,
        setActiveCharacter,
        activeCharacterEmotion,
        setActiveCharacterEmotion,
        activeCharacterText,
        setActiveCharacterText,
        stageStartQuote,
        setStageStartQuote,
        bossUI,
        setBossUI,
        spellCardUI,
        setSpellCardUI,
    };
};
