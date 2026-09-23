import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import MemoryList from '../components/MemoryList'
import MemoryForm from '../components/MemoryForm'
import '../styles/Dashboard.css'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [memories, setMemories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingMemory, setEditingMemory] = useState(null)
  const [filter, setFilter] = useState('all')
  const navigate = useNavigate()

  // Load memories
  useEffect(() => {
    fetchMemories()
  }, [])

  const fetchMemories = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:5000/api/memories', {
        headers: { 'x-user-id': user.id }
      })

      if (!response.ok) throw new Error('Failed to load memories')

      const data = await response.json()
      setMemories(data.memories || [])
    } catch (err) {
      setError('Failed to load memories')
    } finally {
      setLoading(false)
    }
  }

  const handleAddMemory = async (memoryData) => {
    try {
      const response = await fetch('http://localhost:5000/api/memories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify(memoryData)
      })

      if (!response.ok) throw new Error('Failed to create memory')

      const data = await response.json()
      setMemories([data.memory, ...memories])
      setShowForm(false)
    } catch (err) {
      setError('Failed to create memory')
    }
  }

  const handleUpdateMemory = async (id, memoryData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/memories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify(memoryData)
      })

      if (!response.ok) throw new Error('Failed to update memory')

      const data = await response.json()
      setMemories(memories.map(m => m.id === id ? data.memory : m))
      setEditingMemory(null)
    } catch (err) {
      setError('Failed to update memory')
    }
  }

  const handleDeleteMemory = async (id) => {
    if (!confirm('Are you sure you want to delete this memory?')) return

    try {
      const response = await fetch(`http://localhost:5000/api/memories/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': user.id }
      })

      if (!response.ok) throw new Error('Failed to delete memory')

      setMemories(memories.filter(m => m.id !== id))
    } catch (err) {
      setError('Failed to delete memory')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const filteredMemories = filter === 'all' 
    ? memories 
    : memories.filter(m => m.category === filter)

  const categories = ['all', ...new Set(memories.map(m => m.category))]

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>📝 My Memories</h1>
          <div className="header-actions">
            <span className="user-info">Welcome, {user.username}!</span>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        {error && <div className="error-message">{error}</div>}

        <div className="dashboard-controls">
          <button 
            onClick={() => {
              setShowForm(!showForm)
              setEditingMemory(null)
            }} 
            className="btn-primary"
          >
            {showForm ? '✕ Cancel' : '+ New Memory'}
          </button>

          <div className="filter-group">
            <label>Filter by category:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Memories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {showForm && (
          <MemoryForm 
            onSubmit={editingMemory 
              ? (data) => handleUpdateMemory(editingMemory.id, data)
              : handleAddMemory
            }
            initialMemory={editingMemory}
            onCancel={() => {
              setShowForm(false)
              setEditingMemory(null)
            }}
          />
        )}

        {loading ? (
          <div className="loading">Loading memories...</div>
        ) : filteredMemories.length === 0 ? (
          <div className="empty-state">
            <p>No memories yet. Create your first one!</p>
          </div>
        ) : (
          <MemoryList 
            memories={filteredMemories}
            onEdit={(memory) => {
              setEditingMemory(memory)
              setShowForm(true)
            }}
            onDelete={handleDeleteMemory}
          />
        )}
      </main>
    </div>
  )
}
