// client/src/components/ProductPage.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

import useAuthStore from '../store/useAuthStore';
import { CartContext } from '../context/CartContext';
import Recommendations from './Recommendations';
import ProductPageSkeleton from './ui/skeletons/ProductPageSkeleton';
import ProductGallery from './product/ProductGallery';
import ProductInfo from './product/ProductInfo';
import ProductActions from './product/ProductActions';
import ProductReviews from './product/ProductReviews';

const ProductPage = () => {
    const { id } = useParams();
    const { user } = useAuthStore();
    const { dispatch } = useContext(CartContext);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/products/${id}`);
            setProduct(res.data);
        } catch (err) {
            console.error(err);
            toast.error('Could not load product details.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const logView = async () => {
            if (localStorage.token) {
                try {
                    await axios.post(`/api/history/viewed/${id}`);
                } catch (err) {
                    console.error('Failed to log product view', err);
                }
            }
        };

        setProduct(null);
        setQuantity(1);
        fetchProduct();
        logView();
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleAddToCart = () => {
        if (!product) return;
        if (quantity > product.stock) {
            return toast.warn('Not enough items in stock.');
        }
        dispatch({
            type: 'ADD_TO_CART',
            payload: { ...product, quantity: Number(quantity) },
        });
        toast.success(`${quantity} x ${product.name} added to cart!`);
    };

    const submitReviewHandler = async (e, rating, comment, imageUrl) => {
        e.preventDefault();
        if (rating === 0) {
            return toast.warn('Please select a rating.');
        }
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            await axios.post(
                `/api/products/${id}/reviews`,
                { rating: Number(rating), comment, imageUrl },
                config
            );
            toast.success('Review submitted successfully!');
            fetchProduct();
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Error submitting review.');
        }
    };

    if (loading) return <ProductPageSkeleton />;
    if (!product) return <div className="text-center py-10">Product not found.</div>;

    const isOnFlashSale = product.flashSaleExpires && new Date(product.flashSaleExpires) > new Date();
    const currentPrice = isOnFlashSale ? product.flashSalePrice : (product.isOnSale && product.discountPrice ? product.discountPrice : product.price);
    const originalPrice = product.price;
    const showOriginalPrice = isOnFlashSale || (product.isOnSale && product.discountPrice && product.discountPrice < product.price);

    return (
        <div className="page-wrapper">
            <div className="grid-responsive" style={{ gap: 'var(--spacing-xl)', alignItems: 'start' }}>
                {/* --- Column 1: Image --- */}
                <ProductGallery imageUrl={product.imageUrl} name={product.name} />

                {/* --- Column 2: Details & Actions --- */}
                <div className="product-details-container">
                    <ProductInfo
                        product={product}
                        currentPrice={currentPrice}
                        originalPrice={originalPrice}
                        showOriginalPrice={showOriginalPrice}
                        isOnFlashSale={isOnFlashSale}
                    />

                    <ProductActions
                        product={product}
                        quantity={quantity}
                        setQuantity={setQuantity}
                        onAddToCart={handleAddToCart}
                    />
                </div>
            </div>

            {/* --- Full Width Below: Reviews & Recommendations --- */}
            <div className="mt-5">
                <hr className="my-5" style={{ borderColor: 'var(--glass-border)' }} />

                <ProductReviews
                    reviews={product.reviews}
                    user={user}
                    onSubmitReview={submitReviewHandler}
                />

                <hr className="my-5" style={{ borderColor: 'var(--glass-border)' }} />
                <Recommendations productId={id} />
            </div>
        </div>
    );
};
export default ProductPage;