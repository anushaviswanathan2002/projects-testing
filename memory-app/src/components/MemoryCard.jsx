import '../styles/MemoryCard.css'

export default function MemoryCard({ memory, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const categoryEmojis = {
    general: '📝',
    personal: '💭',
    work: '💼',
    ideas: '💡',
    goals: '🎯'
  }

  return (
    <div className="memory-card">
      <div className="memory-header">
        <div>
          <span className="memory-emoji">{categoryEmojis[memory.category] || '📝'}</span>
          <h3>{memory.title}</h3>
        </div>
        <span className="memory-category">{memory.category}</span>
      </div>

      <p className="memory-content">{memory.content}</p>

      <div className="memory-footer">
        <span className="memory-date">{formatDate(memory.createdAt)}</span>
        <div className="memory-actions">
          <button 
            onClick={() => onEdit(memory)}
            className="btn-edit"
            title="Edit memory"
          >
            ✎ Edit
          </button>
          <button 
            onClick={() => onDelete(memory.id)}
            className="btn-delete"
            title="Delete memory"
          >
            🗑 Delete
          </button>
        </div>
      </div>
    </div>
  )
}
