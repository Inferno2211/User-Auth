import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '';

const PhoneVerification = () => {
    const [verificationCode, setVerificationCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [codeSent, setCodeSent] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);

    const userId = location.state?.userId;

    useEffect(() => {
        if (!userId) {
            navigate('/login');
            return;
        }
    }, [userId, navigate]);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            console.log('running')
            const response = await fetch(`${API_URL}/users/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setUser(data);
                setPhoneNumber(data.number)

                if (data.isPhoneVerified) {
                    navigate('/profile', { state: { userId: data.id } });
                    return;
                }
                else{
                    sendVerificationCode(data.number);
                }
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
        }
    };
    const sendVerificationCode = async (newNumber = null) => {
        try {
            setLoading(true);
            setError('');
            const number = newNumber ? ('+91' + newNumber) : ('+91' + phoneNumber);
            const response = await axios.post(API_URL + '/verify/send', {
                userId,
                newNumber: number
            });
            setCodeSent(true);
            if (newNumber) {
                setPhoneNumber(newNumber);
            }
            setIsEditing(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Error sending verification code');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!verificationCode) {
            setError('Please enter verification code');
            return;
        }

        try {
            setLoading(true);
            setError('');
            const response = await axios.post(API_URL + '/verify/check', {
                userId,
                phoneNumber: '+91' + phoneNumber,
                code: verificationCode
            });

            if (response.isPhoneVerified) {
                navigate('/profile');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error verifying code');
        } finally {
            setLoading(false);
        }
    };

    const handleNumberChange = async (e) => {
        e.preventDefault();
        if (!phoneNumber || phoneNumber.length < 10) {
            setError('Please enter a valid phone number');
            return;
        }
        await sendVerificationCode(phoneNumber);
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f8f8', padding: '2rem' }}>
            <div style={{ maxWidth: '400px', width: '100%', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
                <div>
                    <h2 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
                        Verify Your Phone Number
                    </h2>
                    <p>Code sent to: +91 {phoneNumber}</p>
                    <p style={{ textAlign: 'center', fontSize: '14px', color: '#777' }}>
                        {codeSent ? 'Enter the verification code sent to your phone' : ''}
                    </p>
                </div>

                {isEditing ? (
                    <form onSubmit={handleNumberChange} style={{ marginTop: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline' }}>
                            <label htmlFor="phone" style={{ display: 'none' }}>
                                Phone Number
                            </label>
                            <span>+91</span>
                            <input
                                id="phone"
                                type="tel"
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    marginBottom: '20px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    fontSize: '16px'
                                }}
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="+91 Phone Number"
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    backgroundColor: '#4CAF50',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                }}
                            >
                                Update & Send Code
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    backgroundColor: '#f1f1f1',
                                    color: '#333',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <input
                                type="text"
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    marginBottom: '20px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    fontSize: '16px'
                                }}
                                placeholder="Enter verification code"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                maxLength={6}
                            />
                        </div>

                        {error && (
                            <div style={{ color: 'red', textAlign: 'center', fontSize: '14px' }}>
                                {error}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading || !codeSent}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    backgroundColor: loading || !codeSent ? '#ccc' : '#4CAF50',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontSize: '16px',
                                    cursor: loading || !codeSent ? 'not-allowed' : 'pointer',
                                }}
                            >
                                {loading ? 'Processing...' : 'Verify Code'}
                            </button>
                        </div>

                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                style={{
                                    color: '#4CAF50',
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '14px',
                                    cursor: 'pointer'
                                }}
                            >
                                Change Phone Number
                            </button>
                            <button
                                type="button"
                                onClick={() => sendVerificationCode()}
                                disabled={loading}
                                style={{
                                    color: '#4CAF50',
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '14px',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    marginLeft: '10px'
                                }}
                            >
                                Resend Code
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default PhoneVerification;