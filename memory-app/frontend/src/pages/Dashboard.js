import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MemoryList from '../components/MemoryList';
import MemoryForm from '../components/MemoryForm';
import './Dashboard.css';

function Dashboard({ user, onLogout }) {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMemory, setEditingMemory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/memories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMemories(response.data);
    } catch (error) {
      console.error('Failed to fetch memories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMemory = (memory) => {
    setMemories([memory, ...memories]);
    setShowForm(false);
  };

  const handleUpdateMemory = (updatedMemory) => {
    setMemories(
      memories.map((m) => (m.id === updatedMemory.id ? updatedMemory : m))
    );
    setEditingMemory(null);
    setShowForm(false);
  };

  const handleDeleteMemory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this memory?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/memories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMemories(memories.filter((m) => m.id !== id));
    } catch (error) {
      console.error('Failed to delete memory:', error);
    }
  };

  const handleEditMemory = (memory) => {
    setEditingMemory(memory);
    setShowForm(true);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingMemory(null);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>📝 Memory App</h1>
          <div className="user-info">
            <span>Welcome, {user.email}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-container">
          {showForm ? (
            <MemoryForm
              memory={editingMemory}
              onSave={editingMemory ? handleUpdateMemory : handleAddMemory}
              onCancel={handleCloseForm}
            />
          ) : (
            <div className="dashboard-content">
              <div className="add-memory-section">
                <button className="add-memory-btn" onClick={() => setShowForm(true)}>
                  + Add Memory
                </button>
              </div>

              {loading ? (
                <div className="loading-spinner">Loading your memories...</div>
              ) : memories.length === 0 ? (
                <div className="empty-state">
                  <p>No memories yet. Create your first one!</p>
                </div>
              ) : (
                <MemoryList
                  memories={memories}
                  onEdit={handleEditMemory}
                  onDelete={handleDeleteMemory}
                />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
