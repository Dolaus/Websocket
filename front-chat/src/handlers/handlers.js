import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

export const getUserIdFromToken = (token) => {
    try {
        if (!token) {
            return null
        }
        console.log('token');
        console.log(token);
        const decodedToken = jwtDecode(token);
        return decodedToken.userId;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

export const updateLastMessage = (message, setChats) => {
    setChats(prevChats => prevChats.map(chat => {
        if (chat.chat_name === message.room) {
            return {
                ...chat,
                lastMessage: message
            };
        }
        return chat;
    }));
};

export const handleEditChat = async (chat, setFirstName, setLastName, setSelectedChat, setShowModal, setIsEditing, setInitialFirstName, setInitialLastName) => {
    setInitialFirstName(chat.first_name);
    setInitialLastName(chat.last_name);
    setIsEditing(true);
    setFirstName(chat.first_name);
    setLastName(chat.last_name);
    setSelectedChat(chat.chat_name);
    setShowModal(true);
};

export const handleDeleteChat = async (chatId, token, setChats, setSelectedChat, setMessages) => {
    try {
        await axios.delete(`http://localhost:3000/chat/delete-chat/${chatId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        setChats((prevChats) => prevChats.filter(chat => chat.chat_name !== chatId));
        if (setSelectedChat === chatId) {
            setSelectedChat(null);
            setMessages([]);
        }
    } catch (error) {
        console.error('Error deleting chat:', error);
    }
};

export const handleUpdateChat = async (firstName, lastName, selectedChat, token, setChats, setSelectedChat, setShowModal) => {
    if (!firstName || !lastName) {
        alert('Both fields are required');
        return;
    }

    try {
        await axios.put(`http://localhost:3000/chat/update-chat/${selectedChat}`, {
            first_name: firstName,
            last_name: lastName
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        setChats((prevChats) => prevChats.map(chat =>
            chat.chat_name === selectedChat
                ? {...chat, first_name: firstName, last_name: lastName}
                : chat
        ));

        setSelectedChat(selectedChat);
        setShowModal(false);
    } catch (error) {
        console.error('Error updating chat:', error);
    }
};

export const fetchChats = async (socketIo, token, setChats, setChatUName, setMessages) => {
    try {
        const response = await axios.get('http://localhost:3000/chat/all-user-chats', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        setChats(response.data);

        response.data.forEach(chat => {
            socketIo.emit('joinRoom', chat.chat_name);
        });
    } catch (error) {
        console.error('Error fetching chats:', error);
    }
};

export const handleSendMessage = (socket, selectedChat, messageToSend, setMessageToSend) => {
    if (socket && selectedChat && messageToSend) {
        socket.emit('sendMessage', { room: selectedChat, message: messageToSend });
        setMessageToSend('');
    }
};

export const handleChatSelect = async (chatId, token, setSelectedChat, setMessages, setChatUName) => {
    setSelectedChat(chatId);
    setMessages([]);

    try {
        const response = await axios.get(`http://localhost:3000/chat/get-chat/${chatId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        setChatUName(response.data.first_name + " " + response.data.last_name);
        setMessages(response.data.messages);
    } catch (error) {
        console.error('Error fetching chat messages:', error);
    }
};

export const handleCreateChat = async (firstName, lastName, token, setChats, setSelectedChat, socket, setShowModal) => {
    if (!firstName || !lastName) {
        alert('Both fields are required');
        return;
    }

    try {
        const response = await axios.post('http://localhost:3000/chat/create-chat', {
            firstName,
            lastName
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const newChatName = response.data;
        setChats((prevChats) => [...prevChats, newChatName]);
        socket.emit('joinRoom', newChatName.chat_name);
        setSelectedChat(newChatName.chat_name);
        setShowModal(false);
    } catch (error) {
        console.error('Error creating chat:', error);
    }
};

export const openCreateChatModal = (setFirstName, setLastName, setIsEditing, setShowModal) => {
    setFirstName('');
    setLastName('');
    setIsEditing(false);
    setShowModal(true);
};

export const openEditChatModal = (chat, setFirstName, setLastName, setIsEditing, setShowModal, setInitialFirstName, setInitialLastName) => {
    setInitialFirstName(chat.first_name);
    setInitialLastName(chat.last_name);
    setIsEditing(true);
    setFirstName(chat.first_name);
    setLastName(chat.last_name);
    setShowModal(true);
};