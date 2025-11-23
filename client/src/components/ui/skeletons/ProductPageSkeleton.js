import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ProductPageSkeleton = () => (
  <div className="grid-responsive" style={{ gap: 'var(--spacing-xl)' }}>
    <div>
      <Skeleton height={400} borderRadius="var(--radius-lg)" />
    </div>
    <div>
      <h1><Skeleton width="70%" /></h1>
      <p><Skeleton width="40%" /></p>
      <p><Skeleton width="30%" /></p>
      <hr className="my-4" style={{ borderColor: 'var(--glass-border)' }} />
      <div className="mb-4">
        <span className="text-2xl"><Skeleton width="100px" /></span>
      </div>
      <p><Skeleton count={3} /></p>
      <hr className="my-4" style={{ borderColor: 'var(--glass-border)' }} />
      <div>
        <Skeleton height={40} count={2} style={{ marginBottom: '1rem' }} />
      </div>
    </div>
  </div>
);

export default ProductPageSkeleton;
