import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import ProductList from './ProductList'; // We'll reuse this to show their products!

const RetailerProfilePage = () => {
    const { id } = useParams();
    const [retailer, setRetailer] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRetailerData = async () => {
        setLoading(true);
        try {
            const profileRes = await axios.get(`/api/retailers/${id}`);
            setRetailer(profileRes.data);
            
            const reviewsRes = await axios.get(`/api/retailers/${id}/reviews`);
            setReviews(reviewsRes.data);
        } catch (err) {
            toast.error('Could not load retailer information.');
        } finally {
            setLoading(false);
        }
        };
        fetchRetailerData();
    }, [id]);

    if (loading) return <p>Loading retailer profile...</p>; // Add skeleton later
    if (!retailer) return <p>Retailer not found.</p>;

    return (
        <div>
        <div className="retailer-profile-header">
            <h1>{retailer.name}</h1>
            <p>Average Rating: {retailer.rating.toFixed(1)} / 5 ({retailer.numReviews} Reviews)</p>
        </div>
        
        <hr />
        
        <div className="retailer-reviews">
            <h2>Customer Reviews</h2>
            {reviews.length === 0 ? (
            <p>This seller has no reviews yet.</p>
            ) : (
            reviews.map(review => (
                <div key={review._id} className="review-card">
                <strong>{review.customer?.name || 'Customer'}</strong>
                <p>Rating: {review.rating} / 5</p>
                <p>{review.comment}</p>
                <small>Reviewed on {new Date(review.createdAt).toLocaleDateString()}</small>
                </div>
            ))
            )}
        </div>

        <hr />

        <div className="retailer-products">
            <h2>All Products from this Seller</h2>
            {/* We reuse ProductList and pass the retailer's ID as a filter! */}
            <ProductList retailerId={id} />
        </div>
        </div>
    );
};

export default RetailerProfilePage;