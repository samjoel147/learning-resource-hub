import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import RatingSystem from './RatingSystem';
import CommentSection from './CommentSection';
import './ResourceDetail.css';

const ResourceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResource();
  }, [id]);

  const fetchResource = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/resources/${id}`);
      setResource(response.data);
    } catch (error) {
      setError('Resource not found');
      console.error('Error fetching resource:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this resource?')) {
      return;
    }

    try {
      await api.delete(`/resources/${id}`);
      navigate('/');
    } catch (error) {
      console.error('Error deleting resource:', error);
      alert('Failed to delete resource');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  if (error || !resource) {
    return <div className="error-message">{error || 'Resource not found'}</div>;
  }

  const isOwner = user && resource.author._id === user.id;

  return (
    <div className="resource-detail">
      <div className="card">
        <div className="resource-detail-header">
          <div>
            <span className={`category-badge category-${resource.category}`}>
              {resource.category}
            </span>
            <h1>{resource.title}</h1>
            <div className="resource-author-info">
              <span>By {resource.author?.name || 'Unknown'}</span>
              <span>•</span>
              <span>{formatDate(resource.createdAt)}</span>
              <span>•</span>
              <span>{resource.views} views</span>
            </div>
          </div>
          {isOwner && (
            <div className="resource-actions">
              <Link to={`/edit-resource/${id}`} className="btn btn-secondary">
                Edit
              </Link>
              <button onClick={handleDelete} className="btn btn-danger">
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="resource-content">
          <div className="resource-description">
            <h3>Description</h3>
            <p>{resource.description}</p>
          </div>

          <div className="resource-body">
            <h3>Content</h3>
            <div className="content-text">{resource.content}</div>
          </div>

          {resource.tags && resource.tags.length > 0 && (
            <div className="resource-tags">
              {resource.tags.map((tag, index) => (
                <span key={index} className="tag">#{tag}</span>
              ))}
            </div>
          )}

          {resource.fileUrl && (
            <div className="resource-file">
              <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                Download File
              </a>
            </div>
          )}
        </div>

        <RatingSystem resource={resource} onRatingUpdate={fetchResource} />
      </div>

      <CommentSection resourceId={id} />
    </div>
  );
};

export default ResourceDetail;

