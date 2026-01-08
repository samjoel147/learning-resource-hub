import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './ResourceUpload.css';

const ResourceUpload = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'notes',
    tags: '',
    fileUrl: '',
    isPublic: true
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const resourceData = {
        ...formData,
        tags: tagsArray
      };

      const response = await api.post('/resources', resourceData);
      navigate(`/resource/${response.data._id}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to upload resource');
      console.error('Error uploading resource:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resource-upload">
      <div className="card">
        <h2>Upload New Resource</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter resource title"
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Brief description of the resource"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Content *</label>
            <textarea
              name="content"
              className="form-control"
              value={formData.content}
              onChange={handleChange}
              required
              placeholder="Main content, notes, code, or tutorial text"
              rows="10"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="notes">Notes</option>
                <option value="tutorial">Tutorial</option>
                <option value="code-snippet">Code Snippet</option>
                <option value="video">Video</option>
                <option value="document">Document</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Tags</label>
              <input
                type="text"
                name="tags"
                className="form-control"
                value={formData.tags}
                onChange={handleChange}
                placeholder="tag1, tag2, tag3"
              />
              <small>Separate tags with commas</small>
            </div>
          </div>

          <div className="form-group">
            <label>File URL (Optional)</label>
            <input
              type="url"
              name="fileUrl"
              className="form-control"
              value={formData.fileUrl}
              onChange={handleChange}
              placeholder="https://example.com/file.pdf"
            />
            <small>Link to external file (PDF, video, etc.)</small>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
              />
              Make this resource public
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Upload Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceUpload;

