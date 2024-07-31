import React from 'react';
import './UniversalButton.css'
const UniversalButton = ({ onClick, label }) => {
    return (
        <button onClick={onClick} className={`custom-button`} >
            {label}
        </button>
    );
};

export default UniversalButton;
