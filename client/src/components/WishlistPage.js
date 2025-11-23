// client/src/components/WishlistPage.js
import React from 'react';
import useAuthStore from '../store/useAuthStore';
import ProductItem from './ProductItem';

const WishlistPage = () => {
    const { wishlist } = useAuthStore();

    return (
        <div>
        <h2>My Wishlist</h2>
        {wishlist.length === 0 ? (
            <p>You haven't added any items to your wishlist yet.</p>
        ) : (
            <div className="product-grid">
            {wishlist.map(product => (
                // --- THIS IS THE FIX ---
                // Add the key prop with the product's unique ID
                <ProductItem key={product._id} product={product} />
            ))}
            </div>
        )}
        </div>
    );
};

export default WishlistPage;