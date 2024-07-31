import React from 'react';
import './UserIcon.css';

const UserIcon = ({ className = '' }) => {
    return (
        <div className={`user-icon ${className}`}>
            <i className="fa-solid fa-user"></i>
            <i className="fa-solid fa-check"></i>
        </div>
    );
};

export default UserIcon;
