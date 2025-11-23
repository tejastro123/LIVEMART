import React from 'react';
import Card from '../ui/Card';

const ProductGallery = ({ imageUrl, name }) => {
  return (
    <Card className="glass-panel p-4">
      <img
        src={imageUrl ? imageUrl.replace('/upload/', '/upload/w_600,q_auto/') : 'https://placehold.co/600x600'}
        alt={name}
        style={{ width: '100%', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
      />
    </Card>
  );
};

export default ProductGallery;
