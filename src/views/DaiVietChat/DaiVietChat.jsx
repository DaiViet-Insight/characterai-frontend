import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import './DaiVietChat.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { ToggleButton } from "../../components/buttons";
import downloadAll from "../../services/downloader.js";
import Video from "../../components/Video/Video.jsx";

const serverUrl = "http://localhost:3005";
const API_BASE_URL = 'https://8009-35-203-188-47.ngrok-free.app';
function removeAccentsAndSpaces(str) {
    // Xóa dấu
    const withoutAccents = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Xóa khoảng trắng
    const withoutSpaces = withoutAccents.replace(/\s/g, "");

    return withoutSpaces;
}

const DaiVietChat = () => {
    const { id } = useParams();
    const [character, setCharacter] = useState({});
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const inputRef = useRef()

    useEffect(() => {
        const fetchCharacter = async () => {
            try {
                const response = await fetch(`${serverUrl}/api/characters/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    }
                });
                const data = await response.json();
                setCharacter(data);
                setMessages([
                    {
                        text: `Xin chào, tôi là ${data.name}, tôi có thể giúp gì cho bạn?`,
                        sentTime: '2024-01-01T12:00:00.000Z',
                        sender: 'Chat Bot',
                    }
                ]);
            } catch (error) {
                console.log("error", error);
            }
        }

        fetchCharacter();
    }, [id]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
        }
    }

    const handleSend = async () => {
        if (!inputMessage) return;
        if (inputRef.current.getIsChecked() === false) {
            const newMessage = {
                text: inputMessage,
                sentTime: '2024-01-01T12:00:00.000Z',
                sender: 'me',
            };
            setMessages([...messages, newMessage]);
            setInputMessage('');
            fetchMessage([...messages, newMessage], newMessage);
        } else {
            handleSend2();
        }
    }

    const fetchMessage = async (chatMessages, newMessage) => {
        const skeletonMessage = {
            text: '...',
            sentTime: '2024-01-01T12:00:00.000Z',
            sender: 'Chat Bot'
        };
        setMessages([...chatMessages, skeletonMessage]);
        const payload = {
            text: newMessage.text, // Assuming newMessage has a 'text' field
            name: newMessage.name || 'DefaultName' // Use a default name if not provided
        };
        console.log(payload)
        const response = await fetch(`${API_BASE_URL}/character/`, {
            method: 'POST', // Assuming the API requires a POST request
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        const newMessageReply = {
            text: data.answer,
            sentTime: new Date().toISOString(), // Use current time for the reply message
            sender: 'Chat Bot'
        };
        console.log(data.answer)
        setMessages([...chatMessages, newMessageReply]);
        textToSpeech(data.answer);
    }

    const [speech, setSpeech] = useState('');

    const textToSpeech = (text) => {
        try {
            const fetchTextToSpeech = async (text) => {
                console.log('text', text);

                const response = await fetch(`${API_BASE_URL}/text-to-video/`, {
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

    // require video

    const handleSend2 = () => {
        if (!inputMessage) return;
        const newMessage = {
            text: inputMessage,
            sentTime: '2024-01-01T12:00:00.000Z',
            sender: 'me',
        };
        setMessages([...messages, newMessage]);
        setInputMessage('');
        fetchVideo([...messages, newMessage], newMessage);
    }

    const fetchVideo = async (chatMessages, newMessage) => {
        const skeletonMessage = {
            text: '...',
            sentTime: '2024-01-01T12:00:00.000Z',
            sender: 'Chat Bot'
        };
        setMessages([...chatMessages, skeletonMessage]);
        const payload = {
            text: newMessage.text, // Assuming newMessage has a 'text' field
            name: newMessage.name || 'DefaultName' // Use a default name if not provided
        };
        console.log(payload);
        const videoUrls = await downloadAll(newMessage.text);
        const newMessageReply = {
            text: "video",
            videoUrls: videoUrls,
            sentTime: new Date().toISOString(), // Use current time for the reply message
            sender: 'Chat Bot'
        };
        setMessages([...chatMessages, newMessageReply]);
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
                        <img src={`${serverUrl}${character.background}`} alt="background" width={'100%'} />
                    )
                }
            </div>
            <div className="chatBox-main">
                <div className="chatBox-header">
                    <div className="chatBox-header-title">
                        <h3>Nhân vật {character.name}</h3>
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
                                                <img src={`${serverUrl}${character.avatar}`} alt="avatar" />
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
                                                    {
                                                        message.text === "video" ? (
                                                            <Video videoUrls={message.videoUrls} />
                                                        ) : (
                                                            <p style={{ whiteSpace: 'pre-line' }}>{message.text}</p>
                                                        )
                                                    }
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
                    <ToggleButton ref={inputRef} />
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