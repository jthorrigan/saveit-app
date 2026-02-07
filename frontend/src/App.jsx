import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import SaveForm from './components/SaveForm';
import SaveList from './components/SaveList';
import FilterBar from './components/FilterBar';
import api from './utils/api';

function App() {
  const [saves, setSaves] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    sourceType: '',
    category: '',
    search: '',
    sortBy: 'created_at',
    order: 'DESC'
  });
  const [editingSave, setEditingSave] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch saves - wrapped in useCallback to prevent dependency issues
  const fetchSaves = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/saves', { params: filters });
      setSaves(response.data);
    } catch (error) {
      console.error('Error fetching saves:', error);
      alert('Failed to fetch saves');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchSaves();
  }, [fetchSaves]);

  const handleSaveSubmit = async (saveData) => {
    try {
      if (editingSave) {
        await api.put(`/saves/${editingSave.id}`, saveData);
        alert('Save updated successfully!');
        setEditingSave(null);
      } else {
        await api.post('/saves', saveData);
        alert('Save created successfully!');
      }
      fetchSaves();
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this save? This action cannot be undone.')) {
      try {
        await api.delete(`/saves/${id}`);
        fetchSaves();
        alert('Save deleted successfully!');
      } catch (error) {
        console.error('Error deleting save:', error);
        alert('Failed to delete save');
      }
    }
  };

  const handleEdit = (save) => {
    setEditingSave(save);
  };

  const handleCancelEdit = () => {
    setEditingSave(null);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>💾 SaveIt App</h1>
        <p>Save articles, links, and content for later</p>
      </header>

      <main className="app-main">
        <div className="form-section">
          <SaveForm
            onSubmit={handleSaveSubmit}
            categories={categories}
            editingSave={editingSave}
            onCancel={handleCancelEdit}
          />
        </div>

        <div className="content-section">
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            categories={categories}
            saves={saves}
          />

          <SaveList
            saves={saves}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
