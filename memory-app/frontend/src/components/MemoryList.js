import React from 'react';
import MemoryCard from './MemoryCard';
import './MemoryList.css';

function MemoryList({ memories, onEdit, onDelete }) {
  return (
    <div className="memory-list">
      <h2>Your Memories</h2>
      <div className="memory-grid">
        {memories.map((memory) => (
          <MemoryCard
            key={memory.id}
            memory={memory}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default MemoryList;
