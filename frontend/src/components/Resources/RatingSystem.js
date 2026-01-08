import React, { useState, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import './RatingSystem.css';

const RatingSystem = ({ resource, onRatingUpdate }) => {
  const { user } = useContext(AuthContext);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userRating, setUserRating] = useState(null);

  React.useEffect(() => {
    if (user && resource.ratings) {
      const existingRating = resource.ratings.find(r => r.user._id === user.id);
      if (existingRating) {
        setUserRating(existingRating.rating);
        setRating(existingRating.rating);
      }
    }
  }, [user, resource]);

  const handleRate = async (value) => {
    if (!user) {
      alert('Please login to rate resources');
      return;
    }

    setLoading(true);
    try {
      await api.post(`/resources/${resource._id}/rate`, { rating: value });
      setUserRating(value);
      setRating(value);
      if (onRatingUpdate) {
        onRatingUpdate();
      }
    } catch (error) {
      console.error('Error rating resource:', error);
      alert('Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (value, interactive = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= value ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
          onMouseEnter={() => interactive && setHover(i)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && !loading && handleRate(i)}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const displayRating = hover || rating || resource.averageRating || 0;

  return (
    <div className="rating-system">
      <div className="rating-display">
        <div className="rating-stars">
          {user ? (
            <div className="interactive-rating">
              {renderStars(hover || rating || 0, true)}
              {userRating && (
                <span className="user-rating-text">Your rating: {userRating}/5</span>
              )}
            </div>
          ) : (
            <div className="static-rating">
              {renderStars(resource.averageRating || 0)}
            </div>
          )}
        </div>
        <div className="rating-info">
          <span className="average-rating">
            {resource.averageRating ? parseFloat(resource.averageRating).toFixed(1) : '0.0'}
          </span>
          <span className="rating-count">
            ({resource.ratings?.length || 0} {resource.ratings?.length === 1 ? 'rating' : 'ratings'})
          </span>
        </div>
      </div>
    </div>
  );
};

export default RatingSystem;

