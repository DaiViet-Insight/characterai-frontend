import React, { useState } from "react";
import { useParams } from "react-router-dom";
import './DaiVietChat.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-solid-svg-icons';

import characters from '../../services/database';

function removeAccentsAndSpaces(str) {
    // Xóa dấu
    const withoutAccents = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Xóa khoảng trắng
    const withoutSpaces = withoutAccents.replace(/\s/g, "");

    return withoutSpaces;
}

const DaiVietChat = () => {
    const { id } = useParams();
    const character = characters.find((character) => character.id === parseInt(id));

    const [messages, setMessages] = useState([
        {
            text: `Xin chào, tôi là ${character.name}, tôi có thể giúp gì cho bạn?`,
            sentTime: '2024-01-01T12:00:00.000Z',
            sender: 'Chat Bot',
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
        }
    }

    const handleSend = async () => {
        if (!inputMessage) return;
        const newMessage = {
            text: inputMessage,
            sentTime: '2024-01-01T12:00:00.000Z',
            sender: 'me',
        };
        setMessages([...messages, newMessage]);
        setInputMessage('');
        fetchMessage([...messages, newMessage], newMessage);
    }

    const fetchMessage = async (chatMessages, newMessage) => {
        const skeletonMessage = {
            text: '...',
            sentTime: '2024-01-01T12:00:00.000Z',
            sender: 'Chat Bot'
        };
        setMessages([...chatMessages, skeletonMessage]);
        const response = await fetch(`http://localhost:3005/chat?message=${newMessage.text}`);
        const data = await response.json();
        const newMessageRepply = {
            text: data.text,
            sentTime: '2024-01-01T12:00:00.000Z',
            sender: 'Chat Bot'
        };
        setMessages([...chatMessages, newMessageRepply]);
        textToSpeech(data.text);
    }

    const [speech, setSpeech] = useState('');

    const textToSpeech = (text) => {
        try {
            const fetchTextToSpeech = async (text) => {
                console.log('text', text);

                const response = await fetch('https://c6c4-34-145-64-153.ngrok-free.app/text-to-video/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text, name: removeAccentsAndSpaces("TranHungDao") }),
                });

                const data = await response.json();
                setSpeech(data.video_url);
            }

            fetchTextToSpeech(text);
        } catch (error) {
            console.log(error);
        }
    }

    const [isRecording, setIsRecording] = useState(false);

    const handleRecord = () => {
        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'vi-VN';
        recognition.onresult = (event) => {
            const text = event.results[0][0].transcript;
            setInputMessage(text);
        }
        setIsRecording(true);
        recognition.start();
        recognition.onend = () => {
            setIsRecording(false);
        }
    }

    return (
        <div className="chatBox">
            <div className="chatBox-video">
                {
                    (speech !== "") ? (
                        <video
                            controls
                            autoPlay
                            src={speech}
                        >
                        </video>
                    ) : (
                        <img src={character.background} alt="background" width={'100%'} />
                    )
                }
            </div>
            <div className="chatBox-main">
                <div className="chatBox-header">
                    <div className="chatBox-header-title">
                        <h3>Đại tướng {character.name}</h3>
                    </div>
                    {/* <div className="chatBox-header-close">
                        <i>X</i>
                    </div> */}
                </div>
                <div className="chatBox-body">
                    <div className="chatBox-body-content">
                        {messages.map((message, index) => {
                            return (
                                message.sender === 'Chat Bot' ? (
                                    <div className="chatBox-body-content-message chatBox-message__incoming" key={index}>
                                        <div className="chatBox-body-content-message-item">
                                            <div className="chatBox-body-content-message-item-avatar">
                                                <img src={character.avatar} alt="avatar" />
                                            </div>
                                            {
                                                // (message.text === '...') ? (
                                                //     <div className="chatBox-body-content-message-item-content">
                                                //         <div className="chatBox-body-content-message-item-content">
                                                //             <script src="https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs" type="module"></script>
                                                //             <dotlottie-player src="" background="transparent" speed="1" style="width: 300px; height: 300px;" loop autoplay></dotlottie-player>
                                                //         </div>
                                                //     </div>
                                                // ) : (
                                                <div className="chatBox-body-content-message-item-content">
                                                    <p style={{ whiteSpace: 'pre-line' }}>{message.text}</p>
                                                </div>
                                                //)
                                            }
                                        </div>
                                    </div>) : (
                                    <div className="chatBox-body-content-message chatBox-message__outgoing" key={index}>
                                        <div className="chatBox-body-content-message-item">
                                            <div className="chatBox-body-content-message-item-avatar">
                                                <img src="https://picsum.photos/200" alt="avatar" />
                                            </div>
                                            <div className="chatBox-body-content-message-item-content">
                                                <p style={{ whiteSpace: 'pre-line' }}>{message.text}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )
                        })}
                    </div>
                </div>
                <div className="chatBox-body-input">
                    <input
                        type="text"
                        placeholder="Nhập tin nhắn..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button 
                        style={{ backgroundColor: isRecording && 'white' }}
                        onClick={() => handleRecord()}
                    >
                        {
                            isRecording ? (
                                <FontAwesomeIcon icon={faCircle} color="red" />
                            ) : (
                                <FontAwesomeIcon icon={faMicrophone} color="white" />
                            )
                        }
                    </button>
                    <button onClick={() => handleSend()}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white dark:text-black"><path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DaiVietChat;