// client/src/components/ReviewSellerPage.js
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import ReviewForm from './ReviewForm'; // Import the reusable form

const ReviewSellerPage = () => {
    const { orderId, retailerId } = useParams();
    const navigate = useNavigate();

    // This function will be passed to the ReviewForm
    const handleReviewSubmit = async ({ rating, comment, imageUrl }) => {
        try {
        const reviewData = {
            rating,
            comment,
            imageUrl,
            orderId // Pass the orderId to the API
        };
        
        await axios.post(`/api/retailers/${retailerId}/reviews`, reviewData);
        
        toast.success('Thank you for your review!');
        navigate('/my-orders'); // Redirect back to orders page
        } catch (err) {
        toast.error(err.response?.data?.msg || 'Error submitting review.');
        }
    };

    return (
        <div>
        <h2>Review Your Order with Seller</h2>
        <p>Your feedback helps other customers and holds sellers accountable.</p>
        {/* Pass the submit handler to the reusable form */}
        <ReviewForm onSubmit={handleReviewSubmit} />
        </div>
    );
};

export default ReviewSellerPage;