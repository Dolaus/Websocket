import React from 'react';
import './ChatList.css';
import UniversalButton from "../universal-button/UniversalButton";
import UserIcon from "../user-icon/UserIcon";
import {format} from "date-fns";

const ChatList = ({chats, selectedChat, onSelectChat, onEditChat, onDeleteChat}) => {
    return (
        <div className="chat-list-container">
            <ul>
                {chats.map((chat) => (
                    <li
                        key={chat._id}
                        className={`chat-item ${selectedChat === chat.chat_name ? 'selected' : ''}`}
                        onClick={() => onSelectChat(chat.chat_name)}
                    >
                        <div className={'chat-user-icon-and-message'}>
                        <UserIcon className={'user-phone'}/>
                        <div>
                            <div className={'chat-name'}>
                                {chat.first_name} {chat.last_name}
                            </div>
                            <div className={'last-message'}>
                                {chat.lastMessage ? (chat.lastMessage.message.length > 9 ? chat.lastMessage.message.slice(0, 10) + '...' : chat.lastMessage.message) : 'No message'}
                            </div>
                        </div>
                        </div>
                        <div className={'chat-date'}>
                            {chat.lastMessage ? format(new Date(chat.lastMessage.date_create), 'MMM d, yyyy') : ''}
                        </div>

                        <div className="chat-actions">
                            <UniversalButton onClick={(e) => {
                                e.stopPropagation();
                                onEditChat(chat);
                            }} label="Edit"/>
                            <UniversalButton onClick={(e) => {
                                e.stopPropagation();
                                onDeleteChat(chat.chat_name);
                            }} label="Delete"/>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatList;
