import React from 'react';
import '../styles/Dashboard.css';

function Dashboard({ user, onLogout }) {
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

      <div className="dashboard-content">
        <div className="welcome-section">
          <h2>Welcome to Memory App</h2>
          <p>Your personal memory and notes application.</p>
          <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
            More features coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
