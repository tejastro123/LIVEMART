// client/src/components/GoogleCallbackHandler.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleCallbackHandler = ({ loadUser }) => {
    const navigate = useNavigate();
    console.log('SUCCESS: GoogleCallbackHandler page has loaded.'); // Check if this page is reached

    useEffect(() => {
        const finalizeConnection = async () => {
        console.log('Calling loadUser to refresh data...'); // Check if this function is called
        await loadUser();
        navigate('/');
        };
        finalizeConnection();
    }, [loadUser, navigate]);

    return <div>Finalizing connection... Please wait.</div>;
};

export default GoogleCallbackHandler;