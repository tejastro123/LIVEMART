import React from 'react';
import DOMPurify from 'dompurify';
import Card from '../ui/Card';
import ReviewForm from '../ReviewForm';

const ProductReviews = ({ reviews, user, onSubmitReview }) => {
  return (
    <div className="product-reviews">
      <h3 className="mb-4">Customer Reviews</h3>
      <div className="grid-responsive" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--spacing-lg)' }}>
        {reviews && reviews.length > 0 ? (
          reviews.map(review => (
            <Card key={review._id} className="review-card">
              <div className="flex-between mb-2">
                <strong>{review.name}</strong>
                <span className="badge badge-sm badge-outline">{review.rating} / 5</span>
              </div>
              <p className="mb-2" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(review.comment) }} />
              <small className="text-muted">Reviewed on {new Date(review.createdAt).toLocaleDateString()}</small>
              {review.imageUrl && (
                <img src={review.imageUrl} alt="Review" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginTop: '10px' }} />
              )}
            </Card>
          ))
        ) : <p className="text-muted">No reviews yet.</p>}
      </div>

      {user && user.role === 'customer' && (
        <div className="mt-5">
          <h3 className="mb-3">Write a Review</h3>
          <Card className="glass-panel p-4">
            <ReviewForm onSubmit={onSubmitReview} />
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
