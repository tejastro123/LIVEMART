// client/src/components/checkout/ShippingStep.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Truck, MessageSquare, User, Mail } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { toast } from 'react-toastify';
import './ShippingStep.css';

const SHIPPING_METHODS = [
  { id: 'standard', name: 'Standard Shipping', price: 0, days: '5-7 business days', icon: '📦' },
  { id: 'express', name: 'Express Shipping', price: 9.99, days: '2-3 business days', icon: '⚡' },
  { id: 'overnight', name: 'Overnight Shipping', price: 19.99, days: '1 business day', icon: '🚀' }
];

const ShippingStep = ({
  user,
  shippingAddress,
  setShippingAddress,
  shippingMethod,
  setShippingMethod,
  orderNotes,
  setOrderNotes,
  isGuest,
  setIsGuest,
  guestInfo,
  setGuestInfo,
  onContinue
}) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ address: '', city: '', postalCode: '', country: '' });

  useEffect(() => {
    if (user && !isGuest) {
      fetchAddresses();
    } else {
      setShowNewAddressForm(true);
    }
  }, [user, isGuest]);

  const fetchAddresses = async () => {
    try {
      const { data } = await axios.get('/api/users/addresses');
      setAddresses(data);
      const defaultAddr = data.find(addr => addr.isDefault);

      if (defaultAddr) {
        setSelectedAddressId(defaultAddr._id);
        setShippingAddress({
          address: defaultAddr.street,
          city: defaultAddr.city,
          postalCode: defaultAddr.postalCode,
          country: defaultAddr.country
        });
      } else if (data.length > 0) {
        setSelectedAddressId(data[0]._id);
        setShippingAddress({
          address: data[0].street,
          city: data[0].city,
          postalCode: data[0].postalCode,
          country: data[0].country
        });
      } else {
        setShowNewAddressForm(true);
      }
    } catch (err) {
      console.error("Failed to fetch addresses");
      setShowNewAddressForm(true);
    }
  };

  useEffect(() => {
    if (!showNewAddressForm && selectedAddressId && addresses.length > 0) {
      const selected = addresses.find(addr => addr._id === selectedAddressId);
      if (selected) {
        setShippingAddress({
          address: selected.street,
          city: selected.city,
          postalCode: selected.postalCode,
          country: selected.country
        });
      }
    }
  }, [selectedAddressId, addresses, showNewAddressForm]);

  const handleSaveNewAddress = () => {
    if (!newAddress.address || !newAddress.city || !newAddress.postalCode || !newAddress.country) {
      toast.error('Please fill in all address fields');
      return;
    }
    setShippingAddress(newAddress);
    setShowNewAddressForm(false);
    toast.success('Address saved');
  };

  const handleContinue = () => {
    // Validation
    if (isGuest && (!guestInfo.name || !guestInfo.email)) {
      toast.error('Please provide your name and email');
      return;
    }

    if (!shippingAddress.address || !shippingAddress.city) {
      toast.error('Please select or enter a shipping address');
      return;
    }

    if (!shippingMethod) {
      toast.error('Please select a shipping method');
      return;
    }

    onContinue();
  };

  return (
    <div className="shipping-step">
      {/* Guest Checkout Option */}
      {!user && (
        <Card className="glass-panel p-5 mb-4">
          <div className="guest-checkout-toggle">
            <div className="toggle-options">
              <button
                className={`toggle-option ${!isGuest ? 'active' : ''}`}
                onClick={() => setIsGuest(false)}
              >
                <User size={18} />
                <span>Sign In</span>
              </button>
              <button
                className={`toggle-option ${isGuest ? 'active' : ''}`}
                onClick={() => setIsGuest(true)}
              >
                <Mail size={18} />
                <span>Continue as Guest</span>
              </button>
            </div>
          </div>

          {isGuest && (
            <div className="guest-info-form">
              <h4 className="form-title">Guest Information</h4>
              <div className="form-grid">
                <Input
                  type="text"
                  placeholder="Full Name *"
                  value={guestInfo.name}
                  onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                  required
                />
                <Input
                  type="email"
                  placeholder="Email Address *"
                  value={guestInfo.email}
                  onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                  required
                />
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Shipping Address */}
      <Card className="glass-panel p-5 mb-4">
        <h3 className="section-title">
          <MapPin size={24} />
          Shipping Address
        </h3>

        {addresses.length > 0 && !showNewAddressForm && !isGuest && (
          <div className="address-selection">
            <select
              className="address-select"
              value={selectedAddressId}
              onChange={(e) => setSelectedAddressId(e.target.value)}
            >
              {addresses.map(addr => (
                <option key={addr._id} value={addr._id}>
                  {addr.addressLabel || 'Address'} - {addr.street}, {addr.city} {addr.isDefault ? '(Default)' : ''}
                </option>
              ))}
            </select>
            <Button variant="outline" size="sm" onClick={() => setShowNewAddressForm(true)}>
              + New Address
            </Button>
          </div>
        )}

        {showNewAddressForm && (
          <div className="new-address-form">
            <Input
              placeholder="Street Address *"
              value={newAddress.address}
              onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
              required
            />
            <div className="form-row">
              <Input
                placeholder="City *"
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                required
              />
              <Input
                placeholder="Postal Code *"
                value={newAddress.postalCode}
                onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                required
              />
            </div>
            <Input
              placeholder="Country *"
              value={newAddress.country}
              onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
              required
            />

            <div className="form-actions">
              <Button onClick={handleSaveNewAddress}>Save Address</Button>
              {addresses.length > 0 && !isGuest && (
                <Button variant="outline" onClick={() => setShowNewAddressForm(false)}>
                  Cancel
                </Button>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Shipping Method */}
      <Card className="glass-panel p-5 mb-4">
        <h3 className="section-title">
          <Truck size={24} />
          Shipping Method
        </h3>

        <div className="shipping-methods">
          {SHIPPING_METHODS.map(method => (
            <button
              key={method.id}
              className={`shipping-method ${shippingMethod === method.id ? 'selected' : ''}`}
              onClick={() => setShippingMethod(method.id)}
            >
              <div className="method-header">
                <div className="method-icon">{method.icon}</div>
                <div className="method-info">
                  <div className="method-name">{method.name}</div>
                  <div className="method-duration">{method.days}</div>
                </div>
              </div>
              <div className="method-price">
                {method.price === 0 ? 'FREE' : `$${method.price.toFixed(2)}`}
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Order Notes */}
      <Card className="glass-panel p-5 mb-4">
        <h3 className="section-title">
          <MessageSquare size={24} />
          Order Notes (Optional)
        </h3>
        <textarea
          className="order-notes-input"
          placeholder="Add special instructions for your order..."
          value={orderNotes}
          onChange={(e) => setOrderNotes(e.target.value)}
          rows={4}
          maxLength={500}
        />
        <div className="character-count">{orderNotes.length}/500 characters</div>
      </Card>

      {/* Continue Button */}
      <div className="step-actions">
        <Button size="lg" onClick={handleContinue} className="continue-btn">
          Continue to Payment
        </Button>
      </div>
    </div>
  );
};

export default ShippingStep;
export { SHIPPING_METHODS };
