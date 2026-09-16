import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useMemoryStore } from '../store/memoryStore';
import MemoryCard from './MemoryCard';
import '../styles/MemoryList.css';

export default function MemoryList({ memories }) {
  const [filter, setFilter] = useState('all'); // all, completed, pending
  const user = useAuthStore((state) => state.user);
  const updateMemory = useMemoryStore((state) => state.updateMemory);
  const deleteMemory = useMemoryStore((state) => state.deleteMemory);

  const filteredMemories = memories.filter((m) => {
    if (filter === 'completed') return m.completed;
    if (filter === 'pending') return !m.completed;
    return true;
  });

  const handleToggle = (memoryId, completed) => {
    updateMemory(user.id, memoryId, { completed: !completed });
  };

  const handleDelete = (memoryId) => {
    if (window.confirm('Delete this memory?')) {
      deleteMemory(user.id, memoryId);
    }
  };

  return (
    <div className="memory-list">
      <div className="filter-buttons">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({memories.length})
        </button>
        <button
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed ({memories.filter(m => m.completed).length})
        </button>
        <button
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending ({memories.filter(m => !m.completed).length})
        </button>
      </div>

      <div className="memories-container">
        {filteredMemories.length === 0 ? (
          <p className="empty-state">
            {filter === 'all' && "No memories yet. Add one to get started!"}
            {filter === 'completed' && "No completed memories yet."}
            {filter === 'pending' && "All caught up! No pending memories."}
          </p>
        ) : (
          filteredMemories.map((memory) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              onToggle={() => handleToggle(memory.id, memory.completed)}
              onDelete={() => handleDelete(memory.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
