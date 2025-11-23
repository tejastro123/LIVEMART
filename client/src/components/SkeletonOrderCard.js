// client/src/components/SkeletonOrderCard.js
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonOrderCard = () => {
    return (
        <div className="order-card">
            <div className="order-card-header">
                <div className="order-card-main">
                    {/* Order Image Skeleton */}
                    <div className="order-image-container">
                        <Skeleton width="100%" height="100%" />
                    </div>

                    {/* Order Info Skeleton */}
                    <div className="order-info">
                        <Skeleton width="60%" height={16} style={{ marginBottom: '8px' }} />
                        <Skeleton width="50%" height={14} style={{ marginBottom: '8px' }} />
                        <Skeleton width="40%" height={14} style={{ marginBottom: '8px' }} />
                        <Skeleton width="80px" height={28} borderRadius="20px" />
                    </div>

                    {/* Order Meta Skeleton */}
                    <div className="order-meta">
                        <Skeleton width="100px" height={32} style={{ marginBottom: '8px' }} />
                        <Skeleton circle width={24} height={24} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonOrderCard;