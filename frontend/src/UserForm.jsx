// UserForm.js
import React, { useState } from 'react';
import axios from 'axios';

const UserForm = () => {
    const [name, setName] = useState('');
    const [socialMediaHandle, setSocialMediaHandle] = useState('');
    const [images, setImages] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('socialMediaHandle', socialMediaHandle);
        images.forEach((image) => {
            formData.append('images', image);
        });

        try {
            await axios.post('/submit', formData, { withCredentials: true });
            alert('Submission successful');
            setName('');
            setSocialMediaHandle('');
            setImages([]);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleFileChange = (e) => {
        setImages([...e.target.files]);
    };

    return (
        <div className="container mt-5">
            <a className='btn btn-primary' href='/admin'>Go To Admin Dashboard</a>
            <h2>User Submission Form</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Social Media Handle"
                        value={socialMediaHandle}
                        onChange={(e) => setSocialMediaHandle(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="file"
                        className="form-control"
                        onChange={handleFileChange}
                        multiple
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
};

export default UserForm;
