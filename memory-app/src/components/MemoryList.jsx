import MemoryCard from './MemoryCard'
import '../styles/MemoryList.css'

export default function MemoryList({ memories, onEdit, onDelete }) {
  return (
    <div className="memory-list">
      {memories.map(memory => (
        <MemoryCard 
          key={memory.id}
          memory={memory}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
