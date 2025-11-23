import React from 'react';
import { Link } from 'react-router-dom';
import Countdown from '../Countdown';

const ProductInfo = ({ product, currentPrice, originalPrice, showOriginalPrice, isOnFlashSale }) => {
  return (
    <div className="product-details">
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{product.name}</h1>
      <p className="text-muted mb-2">
        Sold by: <Link to={`/retailer/${product.retailer?._id}`} className="text-primary">{product.retailer?.name || 'Unknown Seller'}</Link>
      </p>
      <div className="flex items-center gap-2 mb-4">
        <span className="badge badge-accent">Rating: {product.rating?.toFixed(1) || '0.0'} ({product.numReviews} reviews)</span>
        <span className="badge badge-outline">{product.category}</span>
      </div>

      <hr className="my-4" style={{ borderColor: 'var(--glass-border)' }} />

      <div className="price-section mb-4">
        <span className="current-price" style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
          ${currentPrice?.toFixed(2) || 'N/A'}
        </span>
        {showOriginalPrice && (
          <del className="original-price ml-3 text-muted" style={{ fontSize: '1.25rem' }}>
            ${originalPrice?.toFixed(2) || 'N/A'}
          </del>
        )}
      </div>

      {isOnFlashSale && (
        <div className="glass-card p-3 mb-4" style={{
          background: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)',
          border: 'none',
          boxShadow: '0 6px 20px rgba(255, 215, 0, 0.4)',
          borderRadius: '12px'
        }}>
          <p style={{ color: '#1a1a1a', fontWeight: 'bold', marginBottom: '8px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>⚡ Flash Sale! Ends in:</p>
          <Countdown expiryDate={product.flashSaleExpires} />
        </div>
      )}

      <p className="mb-4" style={{ lineHeight: '1.6' }}>{product.description || 'No description available.'}</p>
    </div>
  );
};

export default ProductInfo;
