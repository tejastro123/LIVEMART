// client/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CartProvider } from './context/CartContext';
import { SocketProvider } from './context/SocketContext'; // <-- Import the provider
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SocketProvider> {/* <-- Add the SocketProvider */}
      <CartProvider>
        <App />
      </CartProvider>
    </SocketProvider>
  </React.StrictMode>
);