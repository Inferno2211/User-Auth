import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || '';

const LoginPage = () => {
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        navigate('/profile')
    }, []);

    const handleLogin = (e) => {
        handleSubmit(e);
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = '/users/login';

        try {
            const response = await fetch(API_URL + endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Invalid credentials');
            }

            const data = await response.json();

            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            
            if (!data.isPhoneVerified) {
                navigate('/verify', { state: { userId: data.id } });
            }
            else if (data.isPhoneVerified) {
                navigate('/profile');
            }

            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-form">
            <h2>Login</h2>
            {error && <div className="error">{error}</div>}

            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Login</button>
            </form>

            <button
                className="switch-mode"
                onClick={() => navigate('/')}
            >
                Need an account?
            </button>
        </div>
    );
};

export default LoginPage;