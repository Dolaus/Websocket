import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Auth from './components/auth/Auth';
import ChatList from './components/chat-list/ChatList';
import MessageList from './components/message-list/MessageList';
import './App.css';
import UniversalChatModal from "./components/modal/UniversalChatModal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import SearchBar from "./components/search-bar/SearchBar";
import UniversalButton from "./components/universal-button/UniversalButton";
import UserIcon from "./components/user-icon/UserIcon";
import ChatDetails from "./components/chat-details/ChatDetails";
import * as handlers from './handlers/handlers';

function App() {
    const [token, setToken] = useState(null);
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const selectedChatRef = useRef(null);
    const [messageToSend, setMessageToSend] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [ChatUName, setChatUName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [initialFirstName, setInitialFirstName] = useState('');
    const [initialLastName, setInitialLastName] = useState('');
    const [isSendingMessages, setIsSendingMessages] = useState(false);
    const [intervalId, setIntervalId] = useState(null);

    useEffect(() => {
        selectedChatRef.current = selectedChat;
    }, [selectedChat]);

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = queryParams.get('token');

        if (tokenFromUrl) {
            localStorage.setItem('token', tokenFromUrl);
            setToken(tokenFromUrl);
            window.history.replaceState({}, document.title, "/");
        } else {
            const savedToken = localStorage.getItem('token');
            setToken(savedToken);
        }

        if (token) {
            const socketIo = io('http://localhost:3000', { query: { token } });
            setSocket(socketIo);

            socketIo.on('connect', () => {
                console.log("Socket connected");
                handlers.fetchChats(socketIo, token, setChats, setChatUName, setMessages);
            });

            socketIo.on('message', (message) => {
                console.log('New message received:', message);

                if (selectedChatRef.current === message.room) {
                    setMessages((prevMessages) => [...prevMessages, message]);
                }

                if (message.user !== handlers.getUserIdFromToken(token)) {
                    toast.info(`New message from ${message.chatName}`);
                }
                handlers.updateLastMessage(message, setChats);
            });

            return () => {
                socketIo.disconnect();
            };
        }
    }, [token]);

    const sendRandomMessage = () => {
        if (chats.length === 0) return;
        const randomChat = chats[Math.floor(Math.random() * chats.length)];
        console.log(randomChat);
        handlers.handleSendMessage(socket, randomChat.chat_name, "Random message", () => {});
    };

    const handleToggleSendingMessages = () => {
        if (isSendingMessages) {
            clearInterval(intervalId);
            setIsSendingMessages(false);
        } else {
            const id = setInterval(sendRandomMessage, 1000);
            setIntervalId(id);
            setIsSendingMessages(true);
        }
    };

    const handleSubmit = isEditing ? () => handlers.handleUpdateChat(firstName, lastName, selectedChat, token, setChats, setSelectedChat, setShowModal) : () => handlers.handleCreateChat(firstName, lastName, token, setChats, setSelectedChat, socket, setShowModal);

    return (
        <div className="app-container">
            <ToastContainer />
            <div className="chat-app">
                <div className="chat-list">
                    <div className={"header-chat-list"}>
                        <div className={'header-login'}>
                            <UserIcon />
                            <Auth />
                        </div>
                        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                        {token ? <UniversalButton onClick={() => handlers.openCreateChatModal(setFirstName, setLastName, setIsEditing, setShowModal)} label="Create Chat" /> : null}
                        {token ? (
                            <UniversalButton onClick={handleToggleSendingMessages} className="send-random-button"
                                label = {isSendingMessages ? "Stop Sending" : "Start Sending"}>
                            </UniversalButton>
                        ) : null}
                    </div>
                    <ChatList
                        chats={chats.filter(chat =>
                            `${chat.first_name} ${chat.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
                        )}
                        selectedChat={selectedChat}
                        onSelectChat={(chatId) => handlers.handleChatSelect(chatId, token, setSelectedChat, setMessages, setChatUName)}
                        onEditChat={(chat) => handlers.handleEditChat(chat, setFirstName, setLastName, setSelectedChat, setShowModal, setIsEditing, setInitialFirstName, setInitialLastName)}
                        onDeleteChat={(chatId) => handlers.handleDeleteChat(chatId, token, setChats, setSelectedChat, setMessages)}
                    />
                </div>
                <div className="message-area">
                    <ChatDetails
                        selectedChat={selectedChat}
                        chatName={ChatUName}
                    />
                    <div className="message-list">
                        <MessageList messages={messages} userId={handlers.getUserIdFromToken(token)} />
                    </div>
                    <div className="message-input">
                        <input
                            className={'message-focus'}
                            type="text"
                            value={messageToSend}
                            onChange={(e) => setMessageToSend(e.target.value)}
                            placeholder="Type your message..."
                        />
                        <button onClick={() => handlers.handleSendMessage(socket, selectedChat, messageToSend, setMessageToSend)} className="send-button">
                            <FontAwesomeIcon style={{ opacity: 0.5 }} icon={faPaperPlane} />
                        </button>
                    </div>
                </div>
                {showModal && (
                    <UniversalChatModal
                        isEditing={isEditing}
                        initialFirstName={initialFirstName}
                        initialLastName={initialLastName}
                        firstName={firstName}
                        lastName={lastName}
                        setFirstName={setFirstName}
                        setLastName={setLastName}
                        handleSubmit={handleSubmit}
                        closeModal={() => setShowModal(false)}
                    />
                )}
            </div>
        </div>
    );
}

export default App;
