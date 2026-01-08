import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import ResourceCard from '../Resources/ResourceCard';
import SearchFilters from '../Resources/SearchFilters';
import './Home.css';

const Home = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    tags: '',
    sortBy: 'createdAt',
    order: 'desc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchResources();
  }, [filters, currentPage]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        page: currentPage,
        limit: 12
      };
      const response = await api.get('/resources', { params });
      setResources(response.data.resources);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
    setCurrentPage(1);
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Learning Resource Hub</h1>
        <p>Discover, share, and learn from the best educational resources</p>
      </div>

      <SearchFilters filters={filters} onFilterChange={handleFilterChange} />

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : resources.length === 0 ? (
        <div className="empty-state">
          <p>No resources found. Be the first to upload one!</p>
        </div>
      ) : (
        <>
          <div className="resources-grid">
            {resources.map(resource => (
              <ResourceCard key={resource._id} resource={resource} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-secondary"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                className="btn btn-secondary"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;

