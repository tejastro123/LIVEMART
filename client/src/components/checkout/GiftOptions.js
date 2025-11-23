// client/src/components/checkout/GiftOptions.js
import React from 'react';
import { Gift, MessageCircle } from 'lucide-react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import './GiftOptions.css';

const GiftOptions = ({ giftOptions, setGiftOptions }) => {
  const handleToggleGift = () => {
    if (giftOptions.isGift) {
      // Reset all gift options if unchecking
      setGiftOptions({
        isGift: false,
        giftWrap: false,
        giftMessage: '',
        recipientName: ''
      });
    } else {
      setGiftOptions({ ...giftOptions, isGift: true });
    }
  };

  return (
    <Card className="glass-panel p-5 mb-4">
      <div className="gift-header">
        <h3 className="section-title">
          <Gift size={24} />
          Gift Options
        </h3>
        <label className="gift-toggle">
          <input
            type="checkbox"
            checked={giftOptions.isGift}
            onChange={handleToggleGift}
            className="gift-checkbox"
          />
          <span className="toggle-label">This is a gift</span>
        </label>
      </div>

      {giftOptions.isGift && (
        <div className="gift-content">
          {/* Gift Wrap Option */}
          <div className="gift-option">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={giftOptions.giftWrap}
                onChange={(e) => setGiftOptions({ ...giftOptions, giftWrap: e.target.checked })}
                className="option-checkbox"
              />
              <div className="option-content">
                <div className="option-header">
                  <span className="option-name">Premium Gift Wrapping</span>
                  <span className="option-price">+$5.00</span>
                </div>
                <span className="option-description">
                  Beautiful wrapping with ribbon and gift card
                </span>
              </div>
            </label>
          </div>

          {/* Gift Message */}
          <div className="gift-message-section">
            <label className="message-label">
              <MessageCircle size={18} />
              Gift Message (Optional)
            </label>
            <textarea
              className="gift-message-input"
              placeholder="Write a personal message for the recipient..."
              value={giftOptions.giftMessage}
              onChange={(e) => setGiftOptions({ ...giftOptions, giftMessage: e.target.value })}
              maxLength={200}
              rows={3}
            />
            <div className="character-count">{giftOptions.giftMessage.length}/200 characters</div>
          </div>

          {/* Recipient Name */}
          <div className="recipient-section">
            <Input
              type="text"
              placeholder="Recipient Name (Optional)"
              value={giftOptions.recipientName}
              onChange={(e) => setGiftOptions({ ...giftOptions, recipientName: e.target.value })}
            />
          </div>

          {/* Gift Preview */}
          <div className="gift-preview">
            <div className="preview-icon">🎁</div>
            <div className="preview-text">
              <div className="preview-title">Your gift will be beautifully presented</div>
              {giftOptions.giftWrap && (
                <div className="preview-detail">✓ Premium gift wrapping included</div>
              )}
              {giftOptions.giftMessage && (
                <div className="preview-detail">✓ Personal message included</div>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default GiftOptions;
