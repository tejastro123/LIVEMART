// client/src/components/cart/CartItemCard.js
import { useState } from 'react';
import { Trash2, Package } from 'lucide-react';
import Card from '../ui/Card';
import './CartItemCard.css';

const CartItemCard = ({ item, onUpdateQuantity, onRemove, onSaveForLater }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity > 99) return;

    setIsUpdating(true);
    setQuantity(newQuantity);

    // Debounce the update
    setTimeout(() => {
      onUpdateQuantity(item._id, newQuantity);
      setIsUpdating(false);
    }, 300);
  };

  const incrementQuantity = () => {
    handleQuantityChange(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      handleQuantityChange(quantity - 1);
    }
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    handleQuantityChange(value);
  };

  const itemSubtotal = (item.price * quantity).toFixed(2);

  return (
    <Card className="cart-item-card glass-panel">
      <div className="cart-item-content">
        {/* Product Image */}
        <div className="cart-item-image-wrapper">
          <img
            src={item.imageUrl ? item.imageUrl.replace('/upload/', '/upload/w_150,h_150,c_fill/') : 'https://placehold.co/150'}
            alt={item.name}
            className="cart-item-image"
          />
          {item.stock && item.stock < 10 && (
            <div className="stock-badge low-stock">
              Only {item.stock} left
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="cart-item-details">
          <h3 className="cart-item-name">{item.name}</h3>
          <p className="cart-item-price">
            ${item.price.toFixed(2)}
            <span className="price-label"> each</span>
          </p>
          {item.category && (
            <p className="cart-item-category">{item.category}</p>
          )}

          {/* Quantity Controls */}
          <div className="quantity-controls">
            <button
              className="qty-btn qty-btn-dec"
              onClick={decrementQuantity}
              disabled={quantity <= 1 || isUpdating}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <input
              type="number"
              className="qty-input"
              value={quantity}
              onChange={handleInputChange}
              min="1"
              max="99"
              disabled={isUpdating}
            />
            <button
              className="qty-btn qty-btn-inc"
              onClick={incrementQuantity}
              disabled={quantity >= 99 || isUpdating}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        {/* Actions & Subtotal */}
        <div className="cart-item-actions">
          <div className="cart-item-subtotal">
            <span className="subtotal-label">Subtotal</span>
            <span className="subtotal-amount">${itemSubtotal}</span>
          </div>

          <div className="action-buttons">
            <button
              className="action-btn action-btn-save"
              onClick={() => onSaveForLater(item._id)}
              title="Save for later"
            >
              <Package size={18} />
              <span>Save for Later</span>
            </button>
            <button
              className="action-btn action-btn-remove"
              onClick={() => onRemove(item._id)}
              title="Remove from cart"
            >
              <Trash2 size={18} />
              <span>Remove</span>
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CartItemCard;
