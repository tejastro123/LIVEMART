// client/src/context/SocketContext.js
import React, { createContext } from 'react';
import io from 'socket.io-client';

// Create the socket connection
const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');
export const SocketContext = createContext(socket);

export const SocketProvider = ({ children }) => {
    return (
        <SocketContext.Provider value={socket}>
        {children}
        </SocketContext.Provider>
    );
};