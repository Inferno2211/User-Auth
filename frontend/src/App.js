import React, { useEffect, useState } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || '';

function App() {
  const [isLogin, setIsLogin] = useState(true);
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
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? '/users/login' : '/users/signup';
      const response = await fetch(API_URL + endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.msg || 'An error occurred');

      if (data.token) {
        localStorage.setItem('token', data.token);
        await fetchProfile();
        window.location.reload();
      }
      setError('');
    } catch (err) {
      setError(err.message);
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

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const logout = async () => {
    try {
      await fetch(API_URL + '/users/logout', {
        method: 'POST',
      });
      localStorage.removeItem('token');
      setUser(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const ProfileView = () => (
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

  return (
    <div className="container">
      {user ? (
        <ProfileView />
      ) : (
        <div className="auth-form">
          <h2>{isLogin ? 'Login' : 'Register'}</h2>
          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit}>
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

            {!isLogin && (
              <>
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
              </>
            )}

            <button type="submit">
              {isLogin ? 'Login' : 'Register'}
            </button>
          </form>

          <button
            className="switch-mode"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Need an account?' : 'Already have an account?'}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;