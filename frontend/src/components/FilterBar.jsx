import React from 'react';
import './FilterBar.css';

const FilterBar = ({ filters, onFilterChange, categories, saves }) => {
  const sourceTypes = [...new Set(saves.map(s => s.source_type))];

  const handleChange = (filterName, value) => {
    onFilterChange({
      ...filters,
      [filterName]: value
    });
  };

  const handleReset = () => {
    onFilterChange({
      sourceType: '',
      category: '',
      search: '',
      sortBy: 'created_at',
      order: 'DESC'
    });
  };

  return (
    <div className="filter-bar">
      <h3>Filters & Search</h3>

      <div className="filter-group">
        <label htmlFor="search">🔍 Search</label>
        <input
          id="search"
          type="text"
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          placeholder="Search title, description, notes..."
        />
      </div>

      <div className="filter-row">
        <div className="filter-group">
          <label htmlFor="sourceType">Source Type</label>
          <select
            id="sourceType"
            value={filters.sourceType}
            onChange={(e) => handleChange('sourceType', e.target.value)}
          >
            <option value="">All Types</option>
            {sourceTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={filters.category}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="filter-row">
        <div className="filter-group">
          <label htmlFor="sortBy">Sort By</label>
          <select
            id="sortBy"
            value={filters.sortBy}
            onChange={(e) => handleChange('sortBy', e.target.value)}
          >
            <option value="created_at">Date Added</option>
            <option value="updated_at">Last Updated</option>
            <option value="title">Title</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="order">Order</label>
          <select
            id="order"
            value={filters.order}
            onChange={(e) => handleChange('order', e.target.value)}
          >
            <option value="DESC">Newest First</option>
            <option value="ASC">Oldest First</option>
          </select>
        </div>
      </div>

      <button className="btn-reset" onClick={handleReset}>
        Clear All Filters
      </button>
    </div>
  );
};

export default FilterBar;
