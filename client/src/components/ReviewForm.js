// client/src/components/ReviewForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ReviewForm = ({ onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [reviewImageUrl, setReviewImageUrl] = useState('');
    const [uploading, setUploading] = useState(false);

    const uploadHandler = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);
        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const { data } = await axios.post('/api/upload', formData, config);
            setReviewImageUrl(data.secure_url);
            toast.info('Image uploaded.');
        } catch (error) {
            toast.error('Image upload failed.');
        } finally {
            setUploading(false);
        }
    };

    const submitHandler = (e) => {
        e.preventDefault();
        if (rating === 0) {
            return toast.warn('Please select a rating.');
        }
        // Call the onSubmit prop passed from the parent page
        onSubmit({ rating: Number(rating), comment, imageUrl: reviewImageUrl });
    };

    return (
        <form className="review-form" onSubmit={submitHandler}>
        <label>Rating</label>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))} required>
            <option value={0}>Select...</option>
            <option value={1}>1 - Poor</option>
            <option value={2}>2 - Fair</option>
            <option value={3}>3 - Good</option>
            <option value={4}>4 - Very Good</option>
            <option value={5}>5 - Excellent</option>
        </select>

        <label>Add a Photo (Optional)</label>
        <input type="file" onChange={uploadHandler} />
        {uploading && <p>Uploading image...</p>}

        <label>Comment</label>
        <textarea rows="4" value={comment} onChange={(e) => setComment(e.target.value)} required></textarea>
        
        <button type="submit" disabled={uploading}>Submit Review</button>
        </form>
    );
};

export default ReviewForm;