// client/src/components/checkout/OrderSummary.js
import React from 'react';
import { ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';
import Card from '../ui/Card';
import { SHIPPING_METHODS } from './ShippingStep';
import './OrderSummary.css';

const OrderSummary = ({
  cart,
  shippingMethod,
  giftOptions,
  appliedCoupon,
  pointsToRedeem,
  calculateSubtotal,
  calculateDiscount,
  calculateTotal,
  isExpanded,
  setIsExpanded
}) => {
  const selectedShippingMethod = SHIPPING_METHODS.find(m => m.id === shippingMethod);
  const shippingCost = selectedShippingMethod?.price || 0;
  const giftWrapCost = giftOptions?.giftWrap ? 5 : 0;
  const pointsDiscount = pointsToRedeem / 10;

  return (
    <Card className="order-summary glass-panel sticky-summary">
      <div className="summary-header" onClick={() => setIsExpanded && setIsExpanded(!isExpanded)}>
        <h3 className="summary-title">
          <ShoppingBag size={20} />
          Order Summary
        </h3>
        {setIsExpanded && (
          <button className="toggle-btn">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        )}
      </div>

      {(!setIsExpanded || isExpanded) && (
        <div className="summary-content">
          {/* Cart Items */}
          <div className="summary-items">
            <div className="items-header">
              <span className="items-count">{cart.length} {cart.length === 1 ? 'Item' : 'Items'}</span>
            </div>
            <div className="items-list">
              {cart.map((item, index) => (
                <div key={item._id} className="summary-item" style={{ animationDelay: `${index * 50}ms` }}>
                  <div className="item-info">
                    <div className="item-name">{item.name}</div>
                    <div className="item-qty">Qty: {item.quantity}</div>
                  </div>
                  <div className="item-price">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="summary-divider" />

          {/* Price Breakdown */}
          <div className="price-breakdown">
            <div className="price-row">
              <span className="price-label">Subtotal</span>
              <span className="price-value">${calculateSubtotal().toFixed(2)}</span>
            </div>

            {appliedCoupon && calculateDiscount() > 0 && (
              <div className="price-row discount-row">
                <span className="price-label">
                  Discount ({appliedCoupon.code})
                </span>
                <span className="price-value discount">-${calculateDiscount().toFixed(2)}</span>
              </div>
            )}

            {pointsDiscount > 0 && (
              <div className="price-row discount-row">
                <span className="price-label">
                  Points ({pointsToRedeem} pts)
                </span>
                <span className="price-value discount">-${pointsDiscount.toFixed(2)}</span>
              </div>
            )}

            <div className="price-row">
              <span className="price-label">Shipping</span>
              <span className="price-value shipping">
                {shippingCost === 0 ? (
                  <span className="free-badge">FREE</span>
                ) : (
                  `$${shippingCost.toFixed(2)}`
                )}
              </span>
            </div>

            {giftWrapCost > 0 && (
              <div className="price-row">
                <span className="price-label">Gift Wrapping</span>
                <span className="price-value">${giftWrapCost.toFixed(2)}</span>
              </div>
            )}

            <div className="summary-divider" />

            <div className="price-row total-row">
              <span className="total-label">Total</span>
              <span className="total-value">${calculateTotal()}</span>
            </div>
          </div>

          {/* Savings Badge */}
          {(calculateDiscount() > 0 || pointsDiscount > 0) && (
            <div className="savings-badge">
              🎉 You're saving ${(calculateDiscount() + pointsDiscount).toFixed(2)}!
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default OrderSummary;
