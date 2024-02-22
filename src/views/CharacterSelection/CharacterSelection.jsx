import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate  } from "react-router-dom"
import './CharacterSelection.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

const serverUrl = process.env.REACT_APP_CHARACTER_AI_URL;

const CharacterSelection = () => {
    const [characters, setCharacters] = useState([]);
    const [selectedCharacter, setSelectedCharacter] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCharacters = async () => {
            try {
                const response = await fetch(`${serverUrl}/api/characters`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    }
                });
                const data = await response.json();
                if (data.length > 0) {
                    setSelectedCharacter(data[0]);
                }
                setCharacters(data);
            } catch (error) {
                console.log("error", error);
            }
        }

        fetchCharacters();
    }, []);


    const handleSelectCharater = (id) => {
        navigate(`/chat/${id}`);
    }

    const handleShoppingCharacter = (id) => {
        navigate(`/payment/${id}`);
    }

    return (
        <div className="characterSelection">
            {
                characters && characters.map((character, index) => (
                    <img key={index} src={`${serverUrl}${character.background}`}
                        className={
                            selectedCharacter.name === character.name ? "characterSelection-background characterSelection-background__selected" : "characterSelection-background"
                        }
                        alt="background"
                    />
                ))
            }
            {
                characters && characters.map((character, index) => (
                    <div key={index}>
                        <div key={index}
                            className={"characterSelection-description " + (selectedCharacter.name === character.name ? "characterSelection-description__selected" : "")}
                        >
                            <p className="characterSelection-description-text">{character.description}</p>
                        </div>
                        {
                            (selectedCharacter.isLocked === 0) ? (
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
                    </div>
                ))
            }
            {/* <FontAwesomeIcon icon={faCartShopping} /> */}
            <div className="characterSelection-sidebar">
                <h1 className="characterSelection-title">Chọn nhân vật</h1>
                <ul className="characterSelection-list">
                    {
                        characters.map((character, index) => (
                            <li key={index} className={
                                selectedCharacter.name === character.name ? "characterSelection-item characterSelection-item__selected" : "characterSelection-item"
                            } onClick={() => setSelectedCharacter(character)
                            }>
                                <img className="characterSelection-item-img" src={serverUrl + character.background} alt={character.name} />
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