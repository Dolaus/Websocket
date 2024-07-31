import React from 'react';
import UniversalButton from "../universal-button/UniversalButton";

const Auth = () => {
    const handleLogin = () => {
        window.location.href = 'http://localhost:3000/auth/google';
    };

    return (
        <div>
            <UniversalButton onClick={handleLogin} label="Log in"/>
        </div>
    );
};

export default Auth;
