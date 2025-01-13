import React from 'react';

const LinkedInLogin = () => {
    const handleLinkedInLogin = () => {
        window.location.href = 'http://localhost:8000/linkedin/auth/linkedin';
    };

    return (
        <img
            src="linkedin.png"
            alt="LinkedIn Login"
            onClick={handleLinkedInLogin}
            height={50}
            style={{ marginLeft: 100, marginTop:20, cursor: "pointer" }}
        />
    );
};

export default LinkedInLogin;