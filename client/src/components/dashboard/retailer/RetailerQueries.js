import React, { useState } from 'react';
import { motion } from 'framer-motion';

const RetailerQueries = ({ queries, onReplySubmit, onStatusChange }) => {
  const [activeQueryId, setActiveQueryId] = useState(null);
  const [replyText, setReplyText] = useState('');

  const handleReply = (e, queryId) => {
    e.preventDefault();
    onReplySubmit(queryId, replyText);
    setReplyText('');
  };

  return (
    <section className="dashboard-section" style={{ position: 'sticky', top: 'var(--space-6)' }}>
      <h3>Customer Queries</h3>
      {queries.length > 0 ? queries.map(q => (
        <motion.div
          key={q._id}
          className="query-card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="query-summary" onClick={() => setActiveQueryId(activeQueryId === q._id ? null : q._id)}>
            <div className="flex justify-between items-start">
              <h4 style={{ margin: 0 }}>{q.subject}</h4>
              <span className="text-sm" style={{
                padding: '2px 6px',
                borderRadius: '4px',
                background: q.status === 'Closed' ? 'var(--bg-tertiary)' : 'var(--primary-500)',
                color: 'white'
              }}>{q.status}</span>
            </div>
            <p className="text-sm">From: {q.customer?.name || 'User'}</p>
          </div>
          {activeQueryId === q._id && (
            <div className="conversation-view">
              <div className="message-list">
                {q.messages.map(msg => (
                  <div key={msg._id} className="message" style={{
                    alignSelf: msg.sender === 'retailer' ? 'flex-end' : 'flex-start',
                    background: msg.sender === 'retailer' ? 'var(--primary-600)' : 'var(--bg-card)',
                    color: msg.sender === 'retailer' ? 'white' : 'var(--text-primary)'
                  }}>
                    <strong>{msg.senderName}: </strong>{msg.text}
                  </div>
                ))}
              </div>
              <form onSubmit={(e) => handleReply(e, q._id)}>
                <textarea
                  rows="2"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type reply..."
                ></textarea>
                <div className="flex justify-between items-center">
                  <button type="submit" className="btn btn-sm btn-primary">Send</button>
                  {q.status !== 'Closed' && (
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={() => onStatusChange(q._id, 'Closed')}
                    >
                      Close
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </motion.div>
      )) : (
        <p className="text-secondary">No active queries.</p>
      )}
    </section>
  );
};

export default RetailerQueries;
