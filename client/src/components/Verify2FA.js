// client/src/components/Verify2FA.js
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import useAuthStore from '../store/useAuthStore';
import setAuthToken from '../utils/setAuthToken';

const Verify2FA = () => {
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email; // Get email passed from the Login page
    const { loadUser } = useAuthStore();

    if (!email) {
        // Redirect back to login if email is not available
        navigate('/');
        return null;
    }

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/auth/verify-2fa', { email, otp });
            localStorage.setItem('token', res.data.token);
            setAuthToken(res.data.token);
            
            await loadUser(); // Load user data to complete login
            toast.success('Login Successful!');
            navigate('/'); // Redirect to dashboard
        } catch (err) {
            toast.error('Error: ' + err.response.data.msg);
        }
    };

    return (
        <div className="auth-forms-container">
        <form onSubmit={onSubmit}>
            <h1>Two-Step Verification</h1>
            <h3 style={{color:'yellow'}}>An OTP has been sent to the phone number associated with {email}.</h3>
            <input
                type="text"
                placeholder="6-Digit OTP"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                required
            />
            <button type="submit">Verify & Login</button>
        </form>
        </div>
    );
};

export default Verify2FA;