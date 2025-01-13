// components/AuthCallback.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const firstName = searchParams.get('firstName');
        const lastName = searchParams.get('lastName');
        const email = searchParams.get('email');

        if (firstName && lastName && email) {
            localStorage.setItem('oauthData', JSON.stringify({
                firstname: firstName,
                lastname: lastName,
                email: email
            }));
        }

        navigate('/signup');
    }, [navigate]);

    return (
        <div>Processing...</div>
    );
}

export default AuthCallback;