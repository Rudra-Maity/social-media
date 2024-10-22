// AdminDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuth from './useAuth'; // Import the custom hook

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);

    // Check authentication
    useAuth(); // This will redirect if not logged in

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/users', { withCredentials: true });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
                // Optionally handle error here (e.g., navigate to login)
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="container mt-5">
            <h2>User Submissions</h2>
            <div className="row">
                {users.map((user) => (
                    <div className="col-md-4 mb-4" key={user._id}>
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{user.name}</h5>
                                <p className="card-text"><a href={user.socialMediaHandle}> {user.socialMediaHandle}</a></p>
                                <div className="d-flex flex-wrap">
                                    {user.images.map((image, index) => (
                                        <img 
                                            key={index} 
                                            src={`http://localhost:5000/${image}`} 
                                            alt={`User image ${index + 1}`} 
                                            width="100" 
                                            className="me-2 mb-2" 
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
