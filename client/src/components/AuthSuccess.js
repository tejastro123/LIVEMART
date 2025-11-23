// client/src/components/AuthSuccess.js
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const AuthSuccess = ({ loadUser }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        console.log('AuthSuccess page loaded.');
        const token = searchParams.get('token');
        if (token) {
            console.log('Token found in URL:', token);
            localStorage.setItem('token', token);
            loadUser().then(() => {
                console.log('User loaded, redirecting to dashboard.');
                navigate('/');
            });
        } else {
            console.error('ERROR: No token found in URL.');
            navigate('/'); // Redirect home if no token is found
        }
    }, [searchParams, navigate, loadUser]);

    return <div>Logging you in...</div>;
};

export default AuthSuccess;