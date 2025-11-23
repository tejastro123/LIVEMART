// client/src/components/cart/SavedItemsSection.js
import React from 'react';
import { ShoppingCart, Trash2 } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import './SavedItemsSection.css';

const SavedItemsSection = ({ savedItems, onMoveToCart, onRemove }) => {
  if (savedItems.length === 0) {
    return null;
  }

  return (
    <div className="saved-items-section">
      <h2 className="saved-items-title">
        Saved for Later ({savedItems.length})
      </h2>

      <div className="saved-items-grid">
        {savedItems.map((item) => (
          <Card key={item._id} className="saved-item-card glass-panel">
            <div className="saved-item-image-wrapper">
              <img
                src={item.imageUrl ? item.imageUrl.replace('/upload/', '/upload/w_120,h_120,c_fill/') : 'https://placehold.co/120'}
                alt={item.name}
                className="saved-item-image"
              />
            </div>

            <div className="saved-item-details">
              <h4 className="saved-item-name">{item.name}</h4>
              <p className="saved-item-price">${item.price.toFixed(2)}</p>
            </div>

            <div className="saved-item-actions">
              <Button
                size="sm"
                onClick={() => onMoveToCart(item._id)}
                className="move-to-cart-btn"
              >
                <ShoppingCart size={16} />
                Move to Cart
              </Button>
              <button
                className="remove-saved-btn"
                onClick={() => onRemove(item._id)}
                title="Remove from saved"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SavedItemsSection;
