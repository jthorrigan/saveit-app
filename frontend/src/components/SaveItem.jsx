import React, { useState } from 'react';
import './SaveItem.css';

const SaveItem = ({ save, onEdit, onDelete }) => {
  const [showNotes, setShowNotes] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSourceTypeColor = (sourceType) => {
    const colors = {
      article: '#ff6b6b',
      webpage: '#4ecdc4',
      video: '#ffe66d',
      image: '#a8e6cf',
      file: '#c7ceea',
      other: '#95a5a6'
    };
    return colors[sourceType] || colors.other;
  };

  return (
    <div className="save-item">
      <div className="save-header">
        <h3 className="save-title">{save.title}</h3>
        <span
          className="source-badge"
          style={{ backgroundColor: getSourceTypeColor(save.source_type) }}
        >
          {save.source_type}
        </span>
      </div>

      {save.url && (
        <a href={save.url} target="_blank" rel="noopener noreferrer" className="save-url">
          {save.url.substring(0, 50)}...
        </a>
      )}

      {save.description && (
        <p className="save-description">{save.description}</p>
      )}

      {save.notes && (
        <div className="save-notes-section">
          <button
            className="notes-toggle"
            onClick={() => setShowNotes(!showNotes)}
          >
            {showNotes ? '▼' : '▶'} Notes
          </button>
          {showNotes && (
            <div className="save-notes">
              {save.notes}
            </div>
          )}
        </div>
      )}

      <div className="save-footer">
        <span className="save-date">{formatDate(save.created_at)}</span>
      </div>

      <div className="save-actions">
        <button className="btn-edit" onClick={() => onEdit(save)}>
          ✏️ Edit
        </button>
        <button
          className="btn-delete"
          onClick={() => onDelete(save.id)}
          title="Delete this save"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default SaveItem;
