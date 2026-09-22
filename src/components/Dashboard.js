import React, { useState } from 'react';
import Stopwatch from './Stopwatch';
import '../styles/Dashboard.css';

function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('stopwatch');

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-brand">
            <h1>⏱️ Memory App</h1>
          </div>
          <div className="navbar-user">
            <span className="user-greeting">Welcome, {user.name}!</span>
            <button onClick={onLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === 'stopwatch' ? 'active' : ''}`}
            onClick={() => setActiveTab('stopwatch')}
          >
            ⏱️ Stopwatch
          </button>
          <button
            className={`tab-button ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            📝 Coming Soon
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'stopwatch' && <Stopwatch />}
          {activeTab === 'notes' && (
            <div className="placeholder">
              <h2>📝 Notes Feature</h2>
              <p>Coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
