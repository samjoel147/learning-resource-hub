import React from 'react';
import { Link } from 'react-router-dom';
import './ResourceCard.css';

const ResourceCard = ({ resource }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i}>★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half">☆</span>);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<span key={i} className="star-empty">☆</span>);
    }

    return stars;
  };

  return (
    <Link to={`/resource/${resource._id}`} className="resource-card">
      <div className="card">
        <div className="resource-card-header">
          <span className={`category-badge category-${resource.category}`}>
            {resource.category}
          </span>
          {resource.averageRating > 0 && (
            <div className="rating">
              {renderStars(resource.averageRating)}
              <span className="rating-value">{resource.averageRating}</span>
            </div>
          )}
        </div>
        <h3 className="resource-title">{resource.title}</h3>
        <p className="resource-description">
          {resource.description.length > 150
            ? `${resource.description.substring(0, 150)}...`
            : resource.description}
        </p>
        <div className="resource-meta">
          <div className="resource-author">
            By {resource.author?.name || 'Unknown'}
          </div>
          <div className="resource-stats">
            <span>👁 {resource.views}</span>
            {resource.tags && resource.tags.length > 0 && (
              <span className="tags">
                {resource.tags.slice(0, 2).map((tag, index) => (
                  <span key={index} className="tag">#{tag}</span>
                ))}
              </span>
            )}
          </div>
        </div>
        <div className="resource-footer">
          <span className="resource-date">{formatDate(resource.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
};

export default ResourceCard;

