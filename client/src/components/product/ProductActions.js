import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import WishlistButton from '../WishlistButton';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon
} from 'react-share';

const ProductActions = ({ product, quantity, setQuantity, onAddToCart }) => {
  const getDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const shareUrl = window.location.href;

  return (
    <>
      <Card className="glass-panel p-4 mb-4">
        <div className="flex-between mb-3">
          <strong>Availability:</strong>
          {product.stock > 0 ? (
            <span className="text-success">In Stock ({product.stock} left)</span>
          ) : (
            <span className="text-danger">Out of Stock</span>
          )}
        </div>
        <div className="flex-between mb-4">
          <strong>Estimated Delivery:</strong>
          <span>{getDeliveryDate()}</span>
        </div>

        <div className="flex gap-3 items-end">
          <div style={{ width: '100px' }}>
            <Input
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
              max={product.stock}
              disabled={product.stock === 0}
            />
          </div>
          <div style={{ flex: 1 }}>
            <Button
              size="lg"
              className="w-full"
              onClick={onAddToCart}
              disabled={product.stock === 0}
            >
              Add to Cart
            </Button>
          </div>
          <WishlistButton productId={product._id} />
        </div>
      </Card>

      <div className="share-buttons">
        <h4 className="mb-2">Share:</h4>
        <div className="flex gap-2">
          <FacebookShareButton url={shareUrl} quote={`Check out this product: ${product.name}`}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <TwitterShareButton url={shareUrl} title={`Check out ${product.name} on Live MART!`}>
            <TwitterIcon size={32} round />
          </TwitterShareButton>
          <WhatsappShareButton url={shareUrl} title={`Check out ${product.name} on Live MART!`}>
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
        </div>
      </div>
    </>
  );
};

export default ProductActions;
