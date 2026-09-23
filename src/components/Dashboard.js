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
          <p>Your personal memory and productivity application.</p>
          <div className="features-grid">
            <div className="feature-card">
              <h3>🔐 Secure Login</h3>
              <p>Create your account and access your data anytime.</p>
            </div>
            <div className="feature-card">
              <h3>✨ Organized</h3>
              <p>Keep all your information organized and accessible.</p>
            </div>
            <div className="feature-card">
              <h3>💾 Auto-Save</h3>
              <p>Your data is automatically saved locally.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
