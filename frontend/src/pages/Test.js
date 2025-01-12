import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';

// Configure axios to include credentials
axios.defaults.withCredentials = true;

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check if user is authenticated
        const getUser = async () => {
            try {
                const response = await axios.get('http://localhost:4000/auth/user');
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        getUser();
    }, []);

    return (
        <Router>
            <div className="p-4">
                <nav className="mb-4">
                    <ul className="flex gap-4">
                        <li>
                            <Link to="/" className="text-blue-500 hover:text-blue-700">Home</Link>
                        </li>
                        {!user ? (
                            <li>
                                <a
                                    href="http://localhost:4000/auth/google"
                                    className="text-blue-500 hover:text-blue-700"
                                >
                                    Login with Google
                                </a>
                            </li>
                        ) : (
                            <li>
                                <a
                                    href="http://localhost:4000/auth/logout"
                                    className="text-blue-500 hover:text-blue-700"
                                >
                                    Logout
                                </a>
                            </li>
                        )}
                    </ul>
                </nav>

                <Routes>
                    <Route path="/" element={
                        <div>
                            <h1 className="text-2xl font-bold mb-4">Welcome to Google Auth Demo</h1>
                            {user ? (
                                <div>
                                    <p>Logged in as: {user.displayName}</p>
                                    <img
                                        src={user.photos?.[0]?.value}
                                        alt="Profile"
                                        className="w-16 h-16 rounded-full mt-2"
                                    />
                                </div>
                            ) : (
                                <p>Please log in to continue</p>
                            )}
                        </div>
                    } />
                </Routes>
            </div>
        </Router>
    );
}

export default App;