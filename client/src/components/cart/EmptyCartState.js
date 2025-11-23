// client/src/components/cart/EmptyCartState.js
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Sparkles, TrendingUp } from 'lucide-react';
import Button from '../ui/Button';
import './EmptyCartState.css';

const EmptyCartState = () => {
  return (
    <div className="empty-cart-state">
      <div className="empty-cart-content">
        {/* Icon with animation */}
        <div className="empty-cart-icon-wrapper">
          <div className="empty-cart-icon-bg"></div>
          <ShoppingBag className="empty-cart-icon" size={80} />
          <Sparkles className="sparkle sparkle-1" size={24} />
          <Sparkles className="sparkle sparkle-2" size={20} />
          <Sparkles className="sparkle sparkle-3" size={18} />
        </div>

        {/* Message */}
        <h2 className="empty-cart-title">Your Cart is Empty</h2>
        <p className="empty-cart-description">
          Looks like you haven't added anything to your cart yet. Start exploring our amazing products!
        </p>

        {/* Action Buttons */}
        <div className="empty-cart-actions">
          <Link to="/">
            <Button size="lg" className="start-shopping-btn">
              <ShoppingBag size={20} />
              Start Shopping
            </Button>
          </Link>
          <Link to="/wishlist">
            <Button variant="outline" size="lg">
              View Wishlist
            </Button>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="quick-links">
          <div className="quick-link-item">
            <TrendingUp className="quick-link-icon" size={20} />
            <div>
              <h4>Trending Products</h4>
              <p>Check out what's popular</p>
            </div>
          </div>
          <div className="quick-link-item">
            <Sparkles className="quick-link-icon" size={20} />
            <div>
              <h4>New Arrivals</h4>
              <p>Discover latest items</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyCartState;
