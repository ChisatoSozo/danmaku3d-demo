import React, { useContext, useEffect, useState } from 'react';
import { useKeydown } from '../../hooks/useKeydown';
import { selectSound } from '../../sounds/SFX';
import { PauseContext, UIContext } from '../gameLogic/GeneralContainer';
import { BossUI } from './BossUI';
import { CharacterDialogueText } from './CharacterDialogueText';
import { CharacterPortrait } from './CharacterPortrait';
import { DeadUI } from './DeadUI';
import { Notice } from './Notice';
import { PauseMenu } from './PauseMenu';
import { StageStartQuote } from './StageStartQuote';

export const UI = () => {
    const { isDead, setIsDead, charactersInDialogue, activeCharacter, activeCharacterEmotion, activeCharacterText, stageStartQuote, bossUI, spellCardUI } = useContext(
        UIContext
    );
    const { paused, setPaused } = useContext(PauseContext);

    const [characters, setCharacters] = useState([]);

    useKeydown('MENU', () => {
        if (isDead) return;
        selectSound.play();
        setPaused((paused) => !paused);
    });

    useEffect(() => {
        setCharacters((characters) => {
            const newCharacters = characters.filter((character) => charactersInDialogue.includes(character));
            const newCharacterNames = newCharacters.map((character) => character.name);
            const addingCharacters = charactersInDialogue.filter((character) => !newCharacterNames.includes(character));

            addingCharacters.forEach((character) => {
                newCharacters.push({
                    name: character,
                    side: character === 'player' ? 'left' : 'right',
                    emotion: character === activeCharacter ? activeCharacterEmotion : 'neutral',
                    active: character === activeCharacter,
                    index: 0,
                });
            });
            return newCharacters;
        });
    }, [charactersInDialogue, activeCharacter, activeCharacterEmotion]);

    useEffect(() => {
        setCharacters((characters) => {
            const newCharacters = [...characters];
            newCharacters.forEach((character) => {
                character.active = character.name === activeCharacter;
                character.emotion = character.active ? activeCharacterEmotion : 'neutral';
            });
            return newCharacters;
        });
    }, [activeCharacter, activeCharacterEmotion]);

    return (
        <>
            {characters.map((character) => (
                <CharacterPortrait key={character.name} {...character} />
            ))}
            {activeCharacter && <CharacterDialogueText character={activeCharacter} text={activeCharacterText} />}
            {stageStartQuote && <StageStartQuote text={stageStartQuote} />}
            {paused && !isDead && <PauseMenu />}
            {bossUI && <BossUI bossUIProps={bossUI} spellCardUIProps={spellCardUI} />}
            {isDead && <DeadUI setIsDead={setIsDead} />}
            <Notice />
        </>
    );
};
