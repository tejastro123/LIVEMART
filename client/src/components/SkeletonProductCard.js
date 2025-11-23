// client/src/components/SkeletonProductCard.js
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonProductCard = () => {
    return (
        <div className="product-card">
        <Skeleton height={200} />
        <h3 style={{ marginTop: '1rem' }}>
            <Skeleton count={2} />
        </h3>
        <p>
            <Skeleton width="80%" />
        </p>
        </div>
    );
};

export default SkeletonProductCard;