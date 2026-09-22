import React, { useState, useEffect } from 'react'
import Stopwatch from '../components/Stopwatch'
import '../styles/Dashboard.css'

function Dashboard({ user, onLogout }) {
  const [memories, setMemories] = useState(() => {
    const saved = localStorage.getItem(`memories_${user.id}`)
    return saved ? JSON.parse(saved) : []
  })
  const [newMemory, setNewMemory] = useState('')
  const [activeTab, setActiveTab] = useState('memories')

  useEffect(() => {
    localStorage.setItem(`memories_${user.id}`, JSON.stringify(memories))
  }, [memories, user.id])

  const handleAddMemory = (e) => {
    e.preventDefault()
    if (newMemory.trim()) {
      const memory = {
        id: Date.now(),
        text: newMemory,
        createdAt: new Date().toLocaleString(),
        importance: 'normal'
      }
      setMemories(prev => [memory, ...prev])
      setNewMemory('')
    }
  }

  const handleDeleteMemory = (id) => {
    setMemories(prev => prev.filter(m => m.id !== id))
  }

  const handleUpdateImportance = (id, importance) => {
    setMemories(prev =>
      prev.map(m => m.id === id ? { ...m, importance } : m)
    )
  }

  const sortedMemories = [...memories].sort((a, b) => {
    const order = { important: 0, normal: 1, low: 2 }
    return order[a.importance] - order[b.importance]
  })

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Welcome, {user.username}!</h1>
          <p className="user-email">{user.email}</p>
        </div>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'memories' ? 'active' : ''}`}
          onClick={() => setActiveTab('memories')}
        >
          Memories
        </button>
        <button
          className={`tab-btn ${activeTab === 'stopwatch' ? 'active' : ''}`}
          onClick={() => setActiveTab('stopwatch')}
        >
          Stopwatch
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'memories' && (
          <div className="memories-section">
            <form onSubmit={handleAddMemory} className="memory-form">
              <input
                type="text"
                value={newMemory}
                onChange={(e) => setNewMemory(e.target.value)}
                placeholder="What do you want to remember?"
                className="memory-input"
                maxLength={200}
              />
              <button type="submit" className="add-memory-btn">
                Add Memory
              </button>
            </form>

            <div className="memories-list">
              {sortedMemories.length === 0 ? (
                <div className="empty-state">
                  <p>No memories yet. Start by adding one!</p>
                </div>
              ) : (
                sortedMemories.map(memory => (
                  <div key={memory.id} className={`memory-card importance-${memory.importance}`}>
                    <div className="memory-header">
                      <span className="memory-date">{memory.createdAt}</span>
                      <select
                        value={memory.importance}
                        onChange={(e) => handleUpdateImportance(memory.id, e.target.value)}
                        className="importance-select"
                      >
                        <option value="low">Low</option>
                        <option value="normal">Normal</option>
                        <option value="important">Important</option>
                      </select>
                    </div>
                    <p className="memory-text">{memory.text}</p>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteMemory(memory.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'stopwatch' && (
          <div className="stopwatch-section">
            <Stopwatch />
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
