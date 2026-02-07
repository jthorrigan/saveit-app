import React, { useState, useEffect } from 'react';
import './SaveForm.css';

const SaveForm = ({ onSubmit, categories, editingSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    source_type: 'article',
    notes: '',
    categories: []
  });

  useEffect(() => {
    if (editingSave) {
      setFormData({
        title: editingSave.title || '',
        url: editingSave.url || '',
        description: editingSave.description || '',
        source_type: editingSave.source_type || 'article',
        notes: editingSave.notes || '',
        categories: editingSave.categories ? editingSave.categories.map(c => c.id) : []
      });
    }
  }, [editingSave]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }
    onSubmit(formData);
    setFormData({
      title: '',
      url: '',
      description: '',
      source_type: 'article',
      notes: '',
      categories: []
    });
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      url: '',
      description: '',
      source_type: 'article',
      notes: '',
      categories: []
    });
    onCancel();
  };

  return (
    <form className="save-form" onSubmit={handleSubmit}>
      <h2>{editingSave ? 'Edit Save' : 'Add New Save'}</h2>

      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Enter title"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="url">URL</label>
        <input
          type="url"
          id="url"
          name="url"
          value={formData.url}
          onChange={handleInputChange}
          placeholder="https://example.com"
        />
      </div>

      <div className="form-group">
        <label htmlFor="source_type">Source Type *</label>
        <select
          id="source_type"
          name="source_type"
          value={formData.source_type}
          onChange={handleInputChange}
        >
          <option value="article">Article</option>
          <option value="webpage">Webpage</option>
          <option value="video">Video</option>
          <option value="image">Image</option>
          <option value="file">File</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Brief description"
          rows="3"
        />
      </div>

      <div className="form-group">
        <label>Categories</label>
        <div className="category-checkboxes">
          {categories.map(category => (
            <div key={category.id} className="checkbox-item">
              <input
                type="checkbox"
                id={`cat-${category.id}`}
                checked={formData.categories.includes(category.id)}
                onChange={() => handleCategoryChange(category.id)}
              />
              <label htmlFor={`cat-${category.id}`}>{category.name}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          placeholder="Add optional notes..."
          rows="4"
        />
      </div>

      <div className="form-buttons">
        <button type="submit" className="btn-primary">
          {editingSave ? 'Update Save' : 'Save Item'}
        </button>
        {editingSave && (
          <button type="button" className="btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default SaveForm;
