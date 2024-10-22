// AdminSignup.js
import React, { useState } from 'react';
import axios from 'axios';

const AdminSignup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/admin/register', {
                username,
                password,
            });
            alert(response.data.message);
        } catch (error) {
            console.error('Error during signup:', error);
            alert(error.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Admin Signup</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Signup</button>
            </form>
            <span > Have a Account ?<a href='/admin/login'>Login</a></span>
        </div>
    );
};

export default AdminSignup;
