import React, { useState, useEffect, useRef } from 'react';
import useAuthStore from '../store/useAuthStore.js';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './AIChatWidget.css';

const AIChatWidget = () => {
    const { user } = useAuthStore();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'model',
            parts: [{ text: 'Hi! I am Rocky, your AI assistant. How can I help you today?' }],
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, isTyping]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim() || isTyping) return;

        const userMessage = { role: 'user', parts: [{ text: inputText }], timestamp: new Date() };
        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsTyping(true);

        // Prepare history for the AI (remove our custom 'timestamp' field)
        const history = messages.map(({ role, parts }) => ({ role, parts }));

        try {
            const { data } = await axios.post('/api/ai/chat', {
                message: inputText,
                history: history,
                userRole: user?.role || 'visitor',
                currentPage: location.pathname
            });

            const botMessage = { role: 'model', parts: [{ text: data.reply }], timestamp: new Date() };
            setMessages(prev => [...prev, botMessage]);

        } catch (err) {
            console.error("Chat API error:", err);
            const errorMessage = {
                role: 'model',
                parts: [{ text: "I'm having trouble connecting right now. Please try again later." }],
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    // Render for all logged-in users
    if (!user) {
        return null;
    }

    return (
        <>
            {!isOpen && (
                <button className="ai-chat-fab" onClick={() => setIsOpen(true)}>
                    <span className="ai-chat-fab-icon">🤖</span>
                </button>
            )}

            {isOpen && (
                <div className="ai-chat-widget">
                    <div className="chat-header">
                        <div className="chat-header-info">
                            <div className="chat-avatar">🤖</div>
                            <div className="chat-title">
                                <h3>Rocky AI</h3>
                                <div className="chat-status">Online</div>
                            </div>
                        </div>
                        <button className="close-btn" onClick={() => setIsOpen(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>

                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.role === 'user' ? 'sent' : 'received'}`}>
                                <div className="message-text">{msg.parts[0].text}</div>
                                <div className="message-timestamp">
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="typing-indicator">
                                <div className="typing-dot"></div>
                                <div className="typing-dot"></div>
                                <div className="typing-dot"></div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-input-area">
                        <form onSubmit={handleSendMessage} className="chat-input-form">
                            <input
                                className="chat-input"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Ask anything..."
                                disabled={isTyping}
                            />
                            <button type="submit" className="send-btn" disabled={!inputText.trim() || isTyping}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AIChatWidget;