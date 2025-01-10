import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || '';

const ProfilePage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstname: '',
        lastname: '',
        mobile: '',
        dob: '',
        addressInfo: '',
        city: '',
        state: '',
        pincode: ''
    });

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token){
            navigate('/');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/users/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setUser(data);

                if (!data.isPhoneVerified) {
                    navigate('/verify', { state: { userId: data.id } });
                    return;
                }

                setFormData({
                    email: data.email || '',
                    firstname: data.firstname || '',
                    lastname: data.lastname || '',
                    mobile: data.number || '',
                    dob: data.dob || '',
                    addressInfo: data.address?.addressInfo || '',
                    city: data.address?.city || '',
                    state: data.address?.state || '',
                    pincode: data.address?.pincode || ''
                });
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_URL}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to update profile');
            const updatedUser = await response.json();
            setUser(updatedUser.user);
            setIsEditing(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const logout = async () => {
        try {
            await fetch(API_URL + '/users/logout', { method: 'POST' });
            localStorage.removeItem('token');
            setUser(null);
        } catch (err) {
            setError(err.message);
        }
    };

    if (!user) {
        return (
            <div className="loading">
                <h2>Loading...</h2>
            </div>
        );
    }

    return (
        <div className="profile">
            <h2>Welcome, {user.firstname} {user.lastname}</h2>
            <div className="profile-details">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Mobile:</strong> {user.number}</p>
                <p><strong>DOB:</strong> {new Date(user.dob).toLocaleDateString()}</p>
                {user.address && (
                    <div className="address">
                        <p><strong>Address:</strong> {user.address.addressInfo}</p>
                        <p><strong>City:</strong> {user.address.city}</p>
                        <p><strong>State:</strong> {user.address.state}</p>
                        <p><strong>Pincode:</strong> {user.address.pincode}</p>
                    </div>
                )}
            </div>
            {!isEditing ? (
                <button onClick={() => setIsEditing(true)}>Edit Profile</button>
            ) : (
                <form onSubmit={handleProfileUpdate} className="edit-form">
                    <input
                        type="text"
                        name="firstname"
                        placeholder="First Name"
                        value={formData.firstname}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="lastname"
                        placeholder="Last Name"
                        value={formData.lastname}
                        onChange={handleChange}
                    />
                    <input
                        type="tel"
                        name="mobile"
                        placeholder="Mobile Number"
                        value={formData.mobile}
                        onChange={handleChange}
                    />
                    <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="addressInfo"
                        placeholder="Address"
                        value={formData.addressInfo}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={formData.state}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="pincode"
                        placeholder="Pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                    />
                    <div className='btn_container'>
                        <button type="submit">Save Changes</button>
                        <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                </form>
            )}
            <button onClick={logout} className="logout-btn">Logout</button>
        </div>
    );
};

export default ProfilePage;