import React, {useEffect, useRef} from 'react';
import './MessageList.css';
import UserIcon from "../user-icon/UserIcon";
import {format} from "date-fns";

function MessageList({messages, userId}) {
    const messageEndRef = useRef(null);

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({behavior: 'smooth'});
        }
    }, [messages]);

    return (
        <div className="message-list">
            {messages.map((message, index) => (
                <div key={message.id || index} className={`message-flex ${message.user === userId ? 'my-message' : ''}`}>
                    <UserIcon/>
                    <div key={index}>
                        <div className={'message-date-flex'}>
                            <div  className="message-content"><p className={'message'}>{message.message}</p></div>
                            <div className={'message-date'}>{ format(new Date(message.date_create), 'M/dd/yyyy h:mm a')}</div>
                        </div>
                    </div>
                </div>
            ))}
            <div ref={messageEndRef}/>
        </div>
    );
}

export default MessageList;
