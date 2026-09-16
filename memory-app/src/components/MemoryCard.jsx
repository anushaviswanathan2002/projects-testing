import '../styles/MemoryCard.css';

export default function MemoryCard({ memory, onToggle, onDelete }) {
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`memory-card ${memory.completed ? 'completed' : ''}`}>
      <div className="memory-header">
        <input
          type="checkbox"
          checked={memory.completed}
          onChange={onToggle}
          className="memory-checkbox"
        />
        <h3 className="memory-title">{memory.title}</h3>
        <button onClick={onDelete} className="delete-btn" title="Delete">
          🗑️
        </button>
      </div>
      <p className="memory-content">{memory.content}</p>
      <div className="memory-footer">
        <span className="memory-date">{formatDate(memory.createdAt)}</span>
        <span className={`memory-status ${memory.completed ? 'done' : 'pending'}`}>
          {memory.completed ? '✓ Completed' : 'Pending'}
        </span>
      </div>
    </div>
  );
}
