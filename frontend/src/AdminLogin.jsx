// AdminLogin.js
import React, { useState } from 'react';
import axios from 'axios';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/admin/login', { username, password }, { withCredentials: true });
            alert('Login successful');
            window.location.href = '/admin'; // Redirect to admin dashboard
        } catch (error) {
            console.error('Login failed:', error);
            alert('Invalid credentials');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Admin Login</h2>
            <form onSubmit={handleLogin}>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
            <span > Have Not Account ?<a href='/admin/signup'>Signup</a></span>
        </div>
    );
};

export default AdminLogin;
