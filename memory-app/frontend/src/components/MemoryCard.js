import React from 'react';
import './MemoryCard.css';

function MemoryCard({ memory, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="memory-card">
      <div className="memory-card-header">
        <h3>{memory.title}</h3>
        <span className="memory-date">{formatDate(memory.created_at)}</span>
      </div>
      <p className="memory-content">{memory.content}</p>
      <div className="memory-actions">
        <button className="edit-btn" onClick={() => onEdit(memory)}>
          Edit
        </button>
        <button className="delete-btn" onClick={() => onDelete(memory.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default MemoryCard;
