import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import ResourceCard from './ResourceCard';
import './MyResources.css';

const MyResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyResources();
  }, []);

  const fetchMyResources = async () => {
    try {
      setLoading(true);
      const response = await api.get('/resources/user/my-resources');
      setResources(response.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) {
      return;
    }

    try {
      await api.delete(`/resources/${id}`);
      fetchMyResources();
    } catch (error) {
      console.error('Error deleting resource:', error);
      alert('Failed to delete resource');
    }
  };

  return (
    <div className="my-resources">
      <div className="my-resources-header">
        <h1>My Resources</h1>
        <Link to="/upload" className="btn btn-primary">
          Upload New Resource
        </Link>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : resources.length === 0 ? (
        <div className="empty-state">
          <p>You haven't uploaded any resources yet.</p>
          <Link to="/upload" className="btn btn-primary">
            Upload Your First Resource
          </Link>
        </div>
      ) : (
        <div className="resources-grid">
          {resources.map(resource => (
            <div key={resource._id} className="my-resource-item">
              <ResourceCard resource={resource} />
              <div className="resource-item-actions">
                <Link
                  to={`/resource/${resource._id}`}
                  className="btn btn-secondary btn-sm"
                >
                  View
                </Link>
                <button
                  onClick={() => handleDelete(resource._id)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyResources;

