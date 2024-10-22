// src/useAuth.js
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const useAuth = () => {
    const [isLogged, setIsLogged] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoggedStatus = async () => {
            try {
                const response = await axios.get('/isLogged', { withCredentials: true });
                setIsLogged(response.data.isLogged);
                if (!response.data.isLogged) {
                    navigate('/admin/login'); 
                }
            } catch (error) {
                console.error('Error checking logged status:', error);
                navigate('/admin/login');
            }
        };

        checkLoggedStatus();
    }, [navigate]);

    return isLogged; 
};

export default useAuth;
