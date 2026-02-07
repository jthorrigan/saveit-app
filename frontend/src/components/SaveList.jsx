import React from 'react';
import SaveItem from './SaveItem';
import './SaveList.css';

const SaveList = ({ saves, loading, onEdit, onDelete }) => {
  if (loading) {
    return <div className="loading">Loading saves...</div>;
  }

  if (saves.length === 0) {
    return <div className="empty-state">No saves yet. Create your first save!</div>;
  }

  return (
    <div className="save-list">
      <h2>Your Saves ({saves.length})</h2>
      <div className="saves-grid">
        {saves.map(save => (
          <SaveItem
            key={save.id}
            save={save}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default SaveList;
