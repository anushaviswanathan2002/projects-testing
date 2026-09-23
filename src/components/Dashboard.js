import React, { useState } from 'react';
import '../styles/Dashboard.css';
import Todo from './Todo';

function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-brand">
            <h1>📚 Memory App</h1>
          </div>
          <div className="navbar-user">
            <span className="user-greeting">Welcome, {user.name}!</span>
            <button onClick={onLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="tabs-navigation">
        <button
          className={`tab-btn ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          🏠 Home
        </button>
        <button
          className={`tab-btn ${activeTab === 'todos' ? 'active' : ''}`}
          onClick={() => setActiveTab('todos')}
        >
          📝 To-Do List
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'home' && (
          <div className="welcome-section">
            <h2>Welcome to Memory App</h2>
            <p>Your personal memory and productivity application.</p>
            <div className="features-grid">
              <div className="feature-card">
                <h3>📝 To-Do List</h3>
                <p>Manage your daily tasks and track your productivity.</p>
              </div>
              <div className="feature-card">
                <h3>✨ Organized</h3>
                <p>Keep all your tasks organized and accessible.</p>
              </div>
              <div className="feature-card">
                <h3>💾 Auto-Save</h3>
                <p>Your tasks are automatically saved locally.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'todos' && <Todo />}
      </div>
    </div>
  );
}

export default Dashboard;
