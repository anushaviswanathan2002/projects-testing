import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useMemoryStore } from '../store/memoryStore';
import MemoryForm from '../components/MemoryForm';
import MemoryList from '../components/MemoryList';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const memories = useMemoryStore((state) => state.memories);
  const loadUserMemories = useMemoryStore((state) => state.loadUserMemories);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadUserMemories(user.id);
  }, [user, navigate, loadUserMemories]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>My Memories</h1>
        <div className="header-actions">
          <span className="user-email">{user.email}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <button 
          onClick={() => setShowForm(!showForm)}
          className="add-memory-btn"
        >
          {showForm ? '✕ Cancel' : '+ Add Memory'}
        </button>

        {showForm && <MemoryForm onClose={() => setShowForm(false)} />}

        <div className="stats">
          <p>Total memories: <strong>{memories.length}</strong></p>
          <p>Completed: <strong>{memories.filter(m => m.completed).length}</strong></p>
        </div>

        <MemoryList memories={memories} />
      </main>
    </div>
  );
}
