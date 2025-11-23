// client/src/components/MyQueriesPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import DOMPurify from 'dompurify';

// Assuming you have an AuthContext or are passing the user object
// For this example, let's assume `user` is available.
// In your App.js, you'd pass it like: <Route path="/my-queries" element={<MyQueriesPage user={user} />} />

const MyQueriesPage = ({ user }) => {
    const [queries, setQueries] = useState([]);
    const [activeQueryId, setActiveQueryId] = useState(null);
    const [replyText, setReplyText] = useState('');

    const fetchQueries = async () => {
        try {
            const res = await axios.get('/api/queries/my-queries');
            setQueries(res.data);
        } catch (err) {
            console.error("Failed to fetch queries", err);
        }
    };

    useEffect(() => {
        fetchQueries();
    }, []);

    const handleReplySubmit = async (queryId) => {
        if (!replyText.trim()) return;
        try {
            await axios.post(`/api/queries/${queryId}/reply`, { message: replyText });
            setReplyText('');
            fetchQueries(); // Re-fetch to show the new message
        } catch (err) { toast.success('Failed to send reply.'); }
    };
    
    const handleStatusChange = async (queryId, newStatus) => {
        try {
            await axios.put(`/api/queries/${queryId}/status`, { status: newStatus });
            fetchQueries(); // Re-fetch to show the new status
        } catch (err) { toast.error('Failed to update status.'); }
    };

    return (
        <div>
            <h2>My Support Queries</h2><br></br>
            {queries.map(q => (
                <div key={q._id} className="query-card">
                    <div className="query-summary" onClick={() => setActiveQueryId(activeQueryId === q._id ? null : q._id)}>
                        <h3>{q.subject}</h3>
                        <p>To: {q.retailer?.name || 'Deleted Retailer'} | Status: <strong>{q.status}</strong></p>
                    </div>

                    {activeQueryId === q._id && (
                        <div className="conversation-view">
                            <div className="message-list">
                                {q.messages.map(msg => {
                                    // --- THIS IS THE KEY CHANGE ---
                                    // We check if the message sender's ID matches the logged-in user's ID
                                    const messageClass = msg.sender === user?._id ? 'message-customer' : 'message-retailer';
                                    return (
                                        <div key={msg._id} className={`message ${messageClass}`}>
                                            <strong>{msg.senderName}: </strong>
                                            <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(msg.text) }} />
                                        </div>
                                    );
                                })}
                            </div>
                            <form onSubmit={(e) => { e.preventDefault(); handleReplySubmit(q._id); }}>
                                <textarea rows="3" value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Type your reply..."></textarea>
                                <button type="submit">Send Reply</button>
                            </form>
                            {q.status !== 'Closed' && (
                                <button onClick={() => handleStatusChange(q._id, 'Closed')}>Close Query</button>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default MyQueriesPage;