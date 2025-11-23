import React, { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';

const WholesaleProductItem = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { dispatch } = useContext(CartContext);

  if (!product) {
    return null;
  }

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (quantity > product.stock) {
      return toast.info('Quantity exceeds available stock.');
    }
    if (quantity > 0) {
      dispatch({
        type: 'ADD_TO_CART',
        payload: {
          ...product,
          quantity: parseInt(quantity),
          isWholesale: true
        },
      });
      toast.success(`${quantity} of ${product.name} added to wholesale cart!`);
    }
  };

  return (
    <Card className="product-card h-full flex flex-col" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative' }}>
        <span className="badge badge-accent" style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 1,
          background: 'linear-gradient(135deg, #FF8008 0%, #FFC837 100%)',
          color: 'white',
          padding: '6px 12px',
          borderRadius: '6px',
          fontSize: '0.75rem',
          fontWeight: 'bold',
          boxShadow: '0 4px 12px rgba(255, 128, 8, 0.4)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          WHOLESALE
        </span>

        <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <img
            src={
              product.imageUrl ? product.imageUrl.replace('/upload/', '/upload/w_400,h_400,c_fill,q_auto/') : 'https://placehold.co/400'
            }
            alt={product.name}
            style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}
          />
        </Link>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', lineHeight: '1.4' }}>{product.name}</h3>
        </Link>

        <p className="text-sm text-muted mb-2">
          Sold by: <span className="text-primary font-medium">{product.retailer?.name || 'Unknown Wholesaler'}</span>
        </p>

        <div className="price-container" style={{ marginBottom: '1rem' }}>
          <span className="regular-price" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>${product.price.toFixed(2)}</span>
          <span className="text-xs text-muted ml-2">/ unit</span>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ width: '80px' }}>
            <Input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              style={{ padding: '8px', textAlign: 'center' }}
              className="mb-0"
              placeholder="Qty"
            />
          </div>
          <Button size="sm" onClick={handleAddToCart} style={{ flex: 1, background: 'linear-gradient(135deg, #FF8008 0%, #FFC837 100%)', border: 'none' }}>
            Add to Cart
          </Button>
        </div>
        <div className="mt-2 text-xs text-center text-muted">
          {product.stock} units available
        </div>
      </div>
    </Card>
  );
};

export default WholesaleProductItem;
