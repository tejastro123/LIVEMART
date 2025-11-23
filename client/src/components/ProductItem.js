// client/src/components/ProductItem.js
import React, { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import WishlistButton from './WishlistButton';
import useCompareStore from '../store/useCompareStore';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';

const ProductItem = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { dispatch } = useContext(CartContext);
  const { addToCompare } = useCompareStore();

  if (!product) {
    return null;
  }

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation if inside Link
    if (quantity > 0) {
      dispatch({
        type: 'ADD_TO_CART',
        payload: { ...product, quantity: parseInt(quantity) },
      });
      toast.success(`${quantity} of ${product.name} added to cart!`);
    }
  };

  const handleAddToCompare = (e) => {
    e.preventDefault();
    addToCompare(product);
  };

  return (
    <Card className="product-card h-full flex flex-col" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative' }}>
        {product.isLocalSpecialty && <span className="badge badge-accent" style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>🌟 Local Specialty</span>}
        {product.isOnSale && <div className="badge badge-primary" style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(245, 87, 108, 0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>🔥 SALE</div>}
        <div style={{ position: 'absolute', top: '40px', right: '10px', zIndex: 1 }}>
          <WishlistButton productId={product._id} />
        </div>

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

        <div className="price-container" style={{ marginBottom: '1rem' }}>
          {product.isOnSale && product.discountPrice > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="discount-price" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>${product.discountPrice.toFixed(2)}</span>
              <del className="original-price" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>${product.price.toFixed(2)}</del>
            </div>
          ) : (
            <span className="regular-price" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>${product.price.toFixed(2)}</span>
          )}
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ width: '60px' }}>
            <Input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              style={{ padding: '8px', textAlign: 'center' }}
              className="mb-0"
            />
          </div>
          <Button size="sm" onClick={handleAddToCart} style={{ flex: 1 }}>Add</Button>
        </div>
        <div style={{ marginTop: '8px' }}>
          <Button variant="secondary" size="sm" className="btn-block" onClick={handleAddToCompare} style={{ width: '100%' }}>Compare</Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductItem;
