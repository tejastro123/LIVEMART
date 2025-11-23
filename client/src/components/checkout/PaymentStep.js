// client/src/components/checkout/PaymentStep.js
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, Coins, Tag } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import CouponInput from '../cart/CouponInput';
import { toast } from 'react-toastify';
import './PaymentStep.css';

const stripePromise = loadStripe('pk_test_51SHWe3FHYLLa4HGZVGyXM5v1OCpaabqg5Gm777VxUaGWi8DyH8D7jrn1jfaZF2Hxi2vyDEDLjfBeG0hVxE8xacGN00z8U1k3sr');

// Stripe Payment Form Component
const PaymentForm = ({ onSubmit, isProcessing }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (error) {
      setError(error.message);
      toast.error(error.message);
    } else {
      setError(null);
      onSubmit(paymentMethod);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="card-element-wrapper">
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#fff',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#fa755a',
            },
          },
        }} />
      </div>
      {error && <div className="payment-error">{error}</div>}
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full payment-submit-btn"
        size="lg"
      >
        {isProcessing ? 'Processing...' : 'Continue to Review'}
      </Button>
    </form>
  );
};

const PaymentStep = ({
  user,
  paymentMethod,
  setPaymentMethod,
  pointsToRedeem,
  setPointsToRedeem,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  cartTotal,
  onContinue,
  onPaymentSuccess
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePointsChange = (e) => {
    const points = Number(e.target.value);
    if (points >= 0 && points <= user?.loyaltyPoints) {
      setPointsToRedeem(points);
    }
  };

  const handleOnlinePaymentSubmit = async (paymentMethodObj) => {
    setIsProcessing(true);
    try {
      // Store payment method for later use
      if (onPaymentSuccess) {
        await onPaymentSuccess(paymentMethodObj);
      }
      toast.success('Payment method verified');
      onContinue();
    } catch (error) {
      toast.error('Payment verification failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOfflinePaymentContinue = () => {
    onContinue();
  };

  return (
    <div className="payment-step">
      {/* Coupon Section */}
      <Card className="glass-panel p-5 mb-4">
        <h3 className="section-title">
          <Tag size={24} />
          Promo Code
        </h3>
        <CouponInput
          appliedCoupon={appliedCoupon}
          onApplyCoupon={onApplyCoupon}
          onRemoveCoupon={onRemoveCoupon}
          cartTotal={cartTotal}
        />
      </Card>

      {/* Loyalty Points */}
      {user && user.loyaltyPoints > 0 && (
        <Card className="glass-panel p-5 mb-4">
          <h3 className="section-title">
            <Coins size={24} />
            Redeem Loyalty Points
          </h3>
          <p className="loyalty-info">
            You have <strong className="points-balance">{user.loyaltyPoints}</strong> points available.
            <span className="points-value"> (${(user.loyaltyPoints / 10).toFixed(2)} value)</span>
          </p>
          <div className="points-input-wrapper">
            <input
              type="number"
              value={pointsToRedeem}
              onChange={handlePointsChange}
              max={user.loyaltyPoints}
              min="0"
              className="points-input"
              placeholder="Points to redeem"
            />
            <div className="points-discount">
              Discount: <span className="discount-amount">-${(pointsToRedeem / 10).toFixed(2)}</span>
            </div>
          </div>
        </Card>
      )}

      {/* Payment Method Selection */}
      <Card className="glass-panel p-5 mb-4">
        <h3 className="section-title">
          <CreditCard size={24} />
          Payment Method
        </h3>

        <div className="payment-methods">
          <button
            className={`payment-method-option ${paymentMethod === 'Online' ? 'selected' : ''}`}
            onClick={() => setPaymentMethod('Online')}
          >
            <div className="method-icon">💳</div>
            <div className="method-details">
              <div className="method-name">Credit / Debit Card</div>
              <div className="method-description">Secure payment via Stripe</div>
            </div>
            <div className="method-radio">
              <input
                type="radio"
                checked={paymentMethod === 'Online'}
                onChange={() => setPaymentMethod('Online')}
              />
            </div>
          </button>

          <button
            className={`payment-method-option ${paymentMethod === 'Offline' ? 'selected' : ''}`}
            onClick={() => setPaymentMethod('Offline')}
          >
            <div className="method-icon">💵</div>
            <div className="method-details">
              <div className="method-name">Cash on Delivery</div>
              <div className="method-description">Pay when you receive</div>
            </div>
            <div className="method-radio">
              <input
                type="radio"
                checked={paymentMethod === 'Offline'}
                onChange={() => setPaymentMethod('Offline')}
              />
            </div>
          </button>
        </div>

        <div className="payment-form-container">
          {paymentMethod === 'Online' ? (
            <Elements stripe={stripePromise}>
              <PaymentForm
                onSubmit={handleOnlinePaymentSubmit}
                isProcessing={isProcessing}
              />
            </Elements>
          ) : (
            <div className="offline-payment-info">
              <div className="info-box">
                <p>ℹ️ You will pay in cash when your order is delivered.</p>
                <p className="info-note">Please keep the exact amount ready for a smooth delivery experience.</p>
              </div>
              <Button
                size="lg"
                className="w-full"
                onClick={handleOfflinePaymentContinue}
              >
                Continue to Review
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PaymentStep;
