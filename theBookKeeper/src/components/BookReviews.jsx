import React, { useState, useEffect } from 'react';
import { FiStar, FiUser, FiCalendar } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const BookReviews = ({ bookId, bookTitle }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    text: '',
    title: ''
  });
  const [showForm, setShowForm] = useState(false);

  // Fetch reviews from your backend
  useEffect(() => {
    fetchReviews();
  }, [bookId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/reviews/${bookId}`);
      
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to submit a review');
      return;
    }

    try {
      setSubmitting(true);
      const API_URL = import.meta.env.VITE_API_URL;
      const token = await user.getIdToken();
      
      const response = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bookId,
          bookTitle,
          rating: newReview.rating,
          title: newReview.title,
          text: newReview.text
        })
      });

      if (response.ok) {
        setNewReview({ rating: 5, text: '', title: '' });
        setShowForm(false);
        fetchReviews(); // Refresh reviews
      } else {
        throw new Error('Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            onClick={interactive ? () => onRatingChange(star) : undefined}
            className={`${
              interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
            } transition-transform duration-150`}
            disabled={!interactive}
          >
            <FiStar
              className={`w-5 h-5 ${
                star <= rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-200 dark:border-slate-700">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
          Reviews & Ratings
        </h3>
        {user && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            {showForm ? 'Cancel' : 'Write Review'}
          </button>
        )}
      </div>

      {/* Average Rating Summary */}
      <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-800 dark:text-white">
              {averageRating.toFixed(1)}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-300">
              Average Rating
            </div>
          </div>
          <div>
            {renderStars(Math.round(averageRating))}
            <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <h4 className="text-lg font-medium text-slate-800 dark:text-white mb-4">
            Write a Review
          </h4>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Rating
            </label>
            {renderStars(newReview.rating, true, (rating) => 
              setNewReview({ ...newReview, rating })
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Review Title
            </label>
            <input
              type="text"
              value={newReview.title}
              onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Give your review a title..."
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Your Review
            </label>
            <textarea
              value={newReview.text}
              onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Share your thoughts about this book..."
              required
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-slate-500 hover:bg-slate-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-slate-600 dark:text-slate-400">
            <FiUser className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No reviews yet. Be the first to review this book!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="border border-slate-200 dark:border-slate-600 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {review.firstName?.charAt(0) || review.userName?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-slate-800 dark:text-white">
                      {review.firstName || review.userName || 'Anonymous User'}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                {renderStars(review.rating)}
              </div>
              
              {review.title && (
                <h5 className="font-medium text-slate-800 dark:text-white mb-2">
                  {review.title}
                </h5>
              )}
              
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {review.text}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookReviews;
