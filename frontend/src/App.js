// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import PhoneVerification from './pages/Verify';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import ProfilePage from './pages/Profile';
import AuthCallback from './components/AuthCallback';

function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<SignupPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path='/login' element={<LoginPage /> } />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/verify" element={<PhoneVerification />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;