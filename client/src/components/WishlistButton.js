// client/src/components/WishlistButton.js
import React from 'react';
import useAuthStore from '../store/useAuthStore';

const WishlistButton = ({ productId }) => {
    const { wishlist, addToWishlist, removeFromWishlist } = useAuthStore();
    if (!productId) {
        return null;
    }
    const isWishlisted = wishlist.some(item => item._id === productId);

    const handleClick = (e) => {
        e.preventDefault(); // Prevent navigation if the button is inside a Link
        e.stopPropagation();

        if (isWishlisted) {
            removeFromWishlist(productId);
        } else {
            addToWishlist(productId);
        }
    };

    return (
        <button onClick={handleClick} className="wishlist-btn">
        {isWishlisted ? '❤️' : '♡'}
        </button>
    );
};

export default WishlistButton;