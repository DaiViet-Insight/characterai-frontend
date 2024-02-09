import React from "react";
import { useState } from "react";
import { useNavigate  } from "react-router-dom"
import './CharacterSelection.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

import characters from '../../services/database';

const CharacterSelection = () => {
    

    const [selectedCharacter, setSelectedCharacter] = useState(characters[0]);
    const navigate = useNavigate();
    const handleSelectCharater = (id) => {
        navigate(`/chat/${id}`);
    }

    const handleShoppingCharacter = (id) => {
        navigate(`/plan/${id}`);
    }

    return (
        <div className="characterSelection">
            {
                characters.map((character, index) => (
                    <img key={index} src={character.background}
                        className={
                            selectedCharacter.name === character.name ? "characterSelection-background characterSelection-background__selected" : "characterSelection-background"
                        }
                        alt="background"
                    />
                ))
            }
            {
                characters.map((character, index) => (
                    <>
                        <div key={index}
                            className={"characterSelection-description " + (selectedCharacter.name === character.name ? "characterSelection-description__selected" : "")}
                        >
                            <p className="characterSelection-description-text">{character.description}</p>
                        </div>
                        {
                            (selectedCharacter.isLocked === false) ? (
                                <div className={"characterSelection-action " + (selectedCharacter.name === character.name? "characterSelection-action--active" : "")}>
                                    <button className="characterSelection-action-button" onClick={() => handleSelectCharater(character.id)}>
                                        <FontAwesomeIcon icon={faArrowRight} />
                                    </button>
                                </div>
                            ): (
                                <div className={"characterSelection-action " + (selectedCharacter.name === character.name? "characterSelection-action--active" : "")}>
                                    <button className="characterSelection-action-button" onClick={() => handleShoppingCharacter(character.id)}>
                                        <FontAwesomeIcon icon={faCartShopping} />
                                    </button>
                                </div>
                            )
                        }
                    </>
                ))
            }
            {/* <FontAwesomeIcon icon={faCartShopping} /> */}
            <div className="characterSelection-sidebar">
                <h1 className="characterSelection-title">Chọn vị anh hùng</h1>
                <ul className="characterSelection-list">
                    {
                        characters.map((character, index) => (
                            <li key={index} className={
                                selectedCharacter.name === character.name ? "characterSelection-item characterSelection-item__selected" : "characterSelection-item"
                            } onClick={() => setSelectedCharacter(character)
                            }>
                                <img className="characterSelection-item-img" src={character.background} alt={character.name} />
                                <span className="characterSelection-item-name">{character.name}</span>
                                {
                                    (character.isLocked) ? <span className="characterSelection-item-locked">
                                        <FontAwesomeIcon icon={faLock} className="characterSelection-item-locked-icon" />
                                    </span> : null
                                }
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    );
}

export default CharacterSelection;