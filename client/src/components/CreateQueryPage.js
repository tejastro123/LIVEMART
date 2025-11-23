// client/src/components/CreateQueryPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreateQueryPage = () => {
    const [retailers, setRetailers] = useState([]);
    const [retailerId, setRetailerId] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRetailers = async () => {
            const res = await axios.get('/api/queries/retailers');
            setRetailers(res.data);
        };
        fetchRetailers();
    }, []);

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/queries', { retailerId, subject, message });
            toast.success('Query submitted successfully!');
            navigate('/my-queries');
        } catch (err) { toast.error('Failed to submit query.'); }
    };

    return (
        <form onSubmit={onSubmit}>
            <h2>Raise a New Query</h2>
            <select value={retailerId} onChange={(e) => setRetailerId(e.target.value)} required>
                <option value="">-- Select a Retailer --</option>
                {retailers.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
            </select>
            <input type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
            <textarea rows="6" placeholder="Your message..." value={message} onChange={(e) => setMessage(e.target.value)} required></textarea>
            <button type="submit">Submit Query</button>
        </form>
    );
};

export default CreateQueryPage;