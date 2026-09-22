import { useState } from 'react';
import './Dashboard.css';
import Stopwatch from './Stopwatch';

function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('stopwatch');

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-content">
          <h1 className="app-title">⏱️ Memory App</h1>
          <div className="user-info">
            <span className="username">👤 {user.username}</span>
            <button onClick={onLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'stopwatch' ? 'active' : ''}`}
            onClick={() => setActiveTab('stopwatch')}
          >
            ⏱️ Stopwatch
          </button>
          <button
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Profile
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'stopwatch' && <Stopwatch userId={user.id} />}
          {activeTab === 'profile' && (
            <div className="profile-card">
              <h2>User Profile</h2>
              <div className="profile-info">
                <div className="info-row">
                  <label>Username:</label>
                  <span>{user.username}</span>
                </div>
                <div className="info-row">
                  <label>Email:</label>
                  <span>{user.email}</span>
                </div>
                <div className="info-row">
                  <label>Member Since:</label>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
