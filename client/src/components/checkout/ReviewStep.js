// client/src/components/checkout/ReviewStep.js
import React from 'react';
import { MapPin, Truck, CreditCard, Gift, MessageSquare, Edit2 } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { SHIPPING_METHODS } from './ShippingStep';
import './ReviewStep.css';

const ReviewStep = ({
  cart,
  shippingAddress,
  shippingMethod,
  paymentMethod,
  giftOptions,
  orderNotes,
  guestInfo,
  isGuest,
  appliedCoupon,
  pointsToRedeem,
  onEdit,
  onPlaceOrder,
  isProcessing,
  calculateSubtotal,
  calculateDiscount,
  calculateTotal
}) => {
  const selectedShippingMethod = SHIPPING_METHODS.find(m => m.id === shippingMethod);
  const shippingCost = selectedShippingMethod?.price || 0;
  const giftWrapCost = giftOptions?.giftWrap ? 5 : 0;

  const getDeliveryDate = () => {
    const date = new Date();
    const daysToAdd = shippingMethod === 'overnight' ? 1 : shippingMethod === 'express' ? 3 : 7;
    date.setDate(date.getDate() + daysToAdd);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  return (
    <div className="review-step">
      <div className="review-header">
        <h2 className="review-title">Review Your Order</h2>
        <p className="review-subtitle">Please review your order details before placing it</p>
      </div>

      {/* Guest Info */}
      {isGuest && guestInfo && (
        <Card className="glass-panel p-5 mb-4">
          <div className="review-section-header">
            <h3 className="review-section-title">Contact Information</h3>
          </div>
          <div className="review-content">
            <div className="info-row">
              <span className="info-label">Name:</span>
              <span className="info-value">{guestInfo.name}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email:</span>
              <span className="info-value">{guestInfo.email}</span>
            </div>
          </div>
        </Card>
      )}

      {/* Shipping Address */}
      <Card className="glass-panel p-5 mb-4">
        <div className="review-section-header">
          <h3 className="review-section-title">
            <MapPin size={20} />
            Shipping Address
          </h3>
          <button className="edit-btn" onClick={() => onEdit(1)}>
            <Edit2 size={16} />
            Edit
          </button>
        </div>
        <div className="review-content">
          <p className="address-text">
            {shippingAddress.address}<br />
            {shippingAddress.city}, {shippingAddress.postalCode}<br />
            {shippingAddress.country}
          </p>
        </div>
      </Card>

      {/* Shipping Method */}
      <Card className="glass-panel p-5 mb-4">
        <div className="review-section-header">
          <h3 className="review-section-title">
            <Truck size={20} />
            Delivery Method
          </h3>
          <button className="edit-btn" onClick={() => onEdit(1)}>
            <Edit2 size={16} />
            Edit
          </button>
        </div>
        <div className="review-content">
          <div className="delivery-info">
            <div className="delivery-method">
              <span className="method-icon-large">{selectedShippingMethod?.icon}</span>
              <div>
                <div className="delivery-name">{selectedShippingMethod?.name}</div>
                <div className="delivery-time">{selectedShippingMethod?.days}</div>
              </div>
            </div>
            <div className="delivery-date">
              <span className="date-label">Estimated Delivery:</span>
              <span className="date-value">{getDeliveryDate()}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Payment Method */}
      <Card className="glass-panel p-5 mb-4">
        <div className="review-section-header">
          <h3 className="review-section-title">
            <CreditCard size={20} />
            Payment Method
          </h3>
          <button className="edit-btn" onClick={() => onEdit(2)}>
            <Edit2 size={16} />
            Edit
          </button>
        </div>
        <div className="review-content">
          <div className="payment-info">
            <span className="payment-icon">{paymentMethod === 'Online' ? '💳' : '💵'}</span>
            <span className="payment-name">
              {paymentMethod === 'Online' ? 'Credit/Debit Card' : 'Cash on Delivery'}
            </span>
          </div>
          {appliedCoupon && (
            <div className="applied-discount">
              <span className="discount-icon">🎟️</span>
              <span>Coupon "{appliedCoupon.code}" applied</span>
            </div>
          )}
          {pointsToRedeem > 0 && (
            <div className="applied-discount">
              <span className="discount-icon">💰</span>
              <span>{pointsToRedeem} loyalty points redeemed</span>
            </div>
          )}
        </div>
      </Card>

      {/* Gift Options */}
      {giftOptions?.isGift && (
        <Card className="glass-panel p-5 mb-4">
          <div className="review-section-header">
            <h3 className="review-section-title">
              <Gift size={20} />
              Gift Options
            </h3>
          </div>
          <div className="review-content">
            {giftOptions.giftWrap && <div className="gift-item">✓ Premium Gift Wrapping (+$5.00)</div>}
            {giftOptions.giftMessage && (
              <div className="gift-message-preview">
                <div className="message-label">Gift Message:</div>
                <div className="message-text">"{giftOptions.giftMessage}"</div>
              </div>
            )}
            {giftOptions.recipientName && (
              <div className="gift-item">To: {giftOptions.recipientName}</div>
            )}
          </div>
        </Card>
      )}

      {/* Order Notes */}
      {orderNotes && (
        <Card className="glass-panel p-5 mb-4">
          <div className="review-section-header">
            <h3 className="review-section-title">
              <MessageSquare size={20} />
              Order Notes
            </h3>
          </div>
          <div className="review-content">
            <p className="notes-text">{orderNotes}</p>
          </div>
        </Card>
      )}

      {/* Order Items */}
      <Card className="glass-panel p-5 mb-4">
        <h3 className="review-section-title">Order Items ({cart.length})</h3>
        <div className="order-items">
          {cart.map(item => (
            <div key={item._id} className="order-item">
              <div className="item-details">
                <span className="item-name">{item.name}</span>
                <span className="item-quantity">x {item.quantity}</span>
              </div>
              <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Order Summary */}
      <Card className="glass-panel p-5 mb-6">
        <h3 className="review-section-title">Order Summary</h3>
        <div className="summary-breakdown">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${calculateSubtotal().toFixed(2)}</span>
          </div>
          {appliedCoupon && calculateDiscount() > 0 && (
            <div className="summary-row discount">
              <span>Discount ({appliedCoupon.code})</span>
              <span>-${calculateDiscount().toFixed(2)}</span>
            </div>
          )}
          {pointsToRedeem > 0 && (
            <div className="summary-row discount">
              <span>Loyalty Points ({pointsToRedeem} pts)</span>
              <span>-${(pointsToRedeem / 10).toFixed(2)}</span>
            </div>
          )}
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
          </div>
          {giftWrapCost > 0 && (
            <div className="summary-row">
              <span>Gift Wrapping</span>
              <span>${giftWrapCost.toFixed(2)}</span>
            </div>
          )}
          <div className="summary-divider" />
          <div className="summary-row total">
            <span>Total</span>
            <span>${calculateTotal()}</span>
          </div>
        </div>
      </Card>

      {/* Place Order Button */}
      <div className="review-actions">
        <Button
          size="lg"
          className="place-order-btn"
          onClick={onPlaceOrder}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing Order...' : 'Place Order'}
        </Button>
        <p className="terms-text">
          By placing this order, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default ReviewStep;
