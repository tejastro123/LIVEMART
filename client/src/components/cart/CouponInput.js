// client/src/components/cart/CouponInput.js
import React, { useState } from 'react';
import { Tag, X, Check } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import './CouponInput.css';

// Demo coupons for testing
const DEMO_COUPONS = {
  'SAVE10': { code: 'SAVE10', discount: 10, type: 'percentage', description: '10% off your order' },
  'SAVE20': { code: 'SAVE20', discount: 20, type: 'percentage', description: '20% off your order' },
  'WELCOME20': { code: 'WELCOME20', discount: 20, type: 'percentage', description: 'Welcome discount - 20% off' },
  'FLAT50': { code: 'FLAT50', discount: 50, type: 'fixed', description: '$50 off your order' },
  'FREESHIP': { code: 'FREESHIP', discount: 0, type: 'shipping', description: 'Free shipping' }
};

const CouponInput = ({ appliedCoupon, onApplyCoupon, onRemoveCoupon, cartTotal }) => {
  const [couponCode, setCouponCode] = useState('');
  const [error, setError] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setError('Please enter a coupon code');
      return;
    }

    setIsApplying(true);
    setError('');

    // Simulate API call delay
    setTimeout(() => {
      const coupon = DEMO_COUPONS[couponCode.toUpperCase()];

      if (coupon) {
        onApplyCoupon(coupon);
        setCouponCode('');
        setError('');
      } else {
        setError('Invalid coupon code');
      }

      setIsApplying(false);
    }, 500);
  };

  const handleRemoveCoupon = () => {
    onRemoveCoupon();
    setError('');
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;

    if (appliedCoupon.type === 'percentage') {
      return (cartTotal * appliedCoupon.discount / 100).toFixed(2);
    } else if (appliedCoupon.type === 'fixed') {
      return Math.min(appliedCoupon.discount, cartTotal).toFixed(2);
    }
    return 0;
  };

  return (
    <div className="coupon-section">
      {!appliedCoupon ? (
        <>
          <div className="coupon-input-wrapper">
            <div className="coupon-input-container">
              <Tag className="coupon-icon" size={20} />
              <Input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value.toUpperCase());
                  setError('');
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                className="coupon-input"
              />
            </div>
            <Button
              onClick={handleApplyCoupon}
              disabled={isApplying || !couponCode.trim()}
              size="md"
              className="apply-coupon-btn"
            >
              {isApplying ? 'Applying...' : 'Apply'}
            </Button>
          </div>

          {error && (
            <div className="coupon-error">
              <X size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Suggested Coupons */}
          <div className="suggested-coupons">
            <p className="suggested-label">Available Coupons:</p>
            <div className="coupon-chips">
              {Object.values(DEMO_COUPONS).slice(0, 3).map((coupon) => (
                <button
                  key={coupon.code}
                  className="coupon-chip"
                  onClick={() => {
                    setCouponCode(coupon.code);
                    setError('');
                  }}
                >
                  <Tag size={14} />
                  <span className="coupon-chip-code">{coupon.code}</span>
                  <span className="coupon-chip-desc">{coupon.description}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="applied-coupon">
          <div className="applied-coupon-content">
            <div className="applied-coupon-header">
              <Check className="check-icon" size={20} />
              <div>
                <div className="applied-coupon-code">{appliedCoupon.code}</div>
                <div className="applied-coupon-desc">{appliedCoupon.description}</div>
              </div>
            </div>
            <div className="applied-coupon-discount">
              -${calculateDiscount()}
            </div>
          </div>
          <button
            className="remove-coupon-btn"
            onClick={handleRemoveCoupon}
            title="Remove coupon"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default CouponInput;
