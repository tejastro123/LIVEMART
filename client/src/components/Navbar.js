import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import useAuthStore from '../store/useAuthStore';
import './Navbar.css';
import Button from './ui/Button';
import DarkModeToggle from './DarkModeToggle';

const Navbar = () => {
  const { user, logout, disconnectGoogle } = useAuthStore();
  const { cart } = useContext(CartContext);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar glass-panel">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-text">Live<span className="brand-highlight">MART</span></span>
        </Link>

        <div className={`navbar-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <div className="nav-group">
            <span className="welcome-text">Welcome, {user?.name}</span>
          </div>

          {user?.role === 'customer' && (
            <div className="nav-group">
              <Link to="/nearby-products" className={`nav-link ${isActive('/nearby-products')}`}>Nearby</Link>
              <Link to="/cart" className={`nav-link ${isActive('/cart')}`}>
                Cart <span className="badge">{itemCount}</span>
              </Link>
              <Link to="/contact" className={`nav-link ${isActive('/contact')}`}>Contact</Link>
              <Link to="/faq" className={`nav-link ${isActive('/faq')}`}>FAQ</Link>
            </div>
          )}

          {user?.role === 'retailer' && (
            <div className="nav-group">
              <Link to="/manage-orders" className={`nav-link ${isActive('/manage-orders')}`}>Orders</Link>
              <Link to="/browse-wholesale" className={`nav-link ${isActive('/browse-wholesale')}`}>Wholesale</Link>
              <Link to="/cart" className={`nav-link ${isActive('/cart')}`}>
                Cart <span className="badge">{itemCount}</span>
              </Link>
              <Link to="/wholesale-history" className={`nav-link ${isActive('/wholesale-history')}`}>History</Link>
            </div>
          )}

          <div className="nav-group right-group">
            <Link to="/update-location" className={`nav-link ${isActive('/update-location')}`}>Location</Link>
            <Link to="/profile" className={`nav-link ${isActive('/profile')}`}>Account</Link>

            {user?.isGoogleConnected ? (
              <Button variant="secondary" size="sm" onClick={disconnectGoogle}>
                Disconnect Calendar
              </Button>
            ) : (
              <a href={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/google`} className="btn btn-secondary btn-sm">
                Connect Calendar
              </a>
            )}

            <DarkModeToggle />

            <Button variant="primary" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <span className="hamburger"></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
