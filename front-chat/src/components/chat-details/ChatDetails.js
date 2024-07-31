import React from 'react';
import UserIcon from '../user-icon/UserIcon.js';
import './ChatDetails.css'
const ChatDetails = ({ selectedChat, chatName }) => {
    return (
        <div className="chat-info">
            {selectedChat ? (
                <div className={'chat-details-flex'}>
                    <UserIcon />
                    <p>{chatName}</p>
                </div>
            ) : (
                <p>Select a chat to see info</p>
            )}
        </div>
    );
};

export default ChatDetails;
