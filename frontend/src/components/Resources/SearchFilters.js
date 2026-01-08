import React, { useState } from 'react';
import './SearchFilters.css';

const SearchFilters = ({ filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (field, value) => {
    const newFilters = { ...localFilters, [field]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearch = (e) => {
    handleChange('search', e.target.value);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      category: '',
      tags: '',
      sortBy: 'createdAt',
      order: 'desc'
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="search-filters">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search resources..."
          className="form-control search-input"
          value={localFilters.search}
          onChange={handleSearch}
        />
      </div>

      <div className="filters-row">
        <div className="filter-group">
          <label>Category</label>
          <select
            className="form-control"
            value={localFilters.category}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="notes">Notes</option>
            <option value="tutorial">Tutorial</option>
            <option value="code-snippet">Code Snippet</option>
            <option value="video">Video</option>
            <option value="document">Document</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sort By</label>
          <select
            className="form-control"
            value={localFilters.sortBy}
            onChange={(e) => handleChange('sortBy', e.target.value)}
          >
            <option value="createdAt">Date</option>
            <option value="averageRating">Rating</option>
            <option value="views">Views</option>
            <option value="title">Title</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Order</label>
          <select
            className="form-control"
            value={localFilters.order}
            onChange={(e) => handleChange('order', e.target.value)}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

        <button className="btn btn-secondary" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default SearchFilters;

