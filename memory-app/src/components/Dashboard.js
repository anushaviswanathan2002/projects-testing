import React, { useState } from 'react';
import './Dashboard.css';
import Stopwatch from './Stopwatch';

function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('stopwatch');

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <h1>Welcome, {user.email}!</h1>
          <button className="btn-logout" onClick={onLogout}>
            Logout
          </button>
        </div>

        <div className="dashboard-tabs">
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

        <div className="dashboard-content">
          {activeTab === 'stopwatch' && <Stopwatch />}
          {activeTab === 'profile' && (
            <div className="profile-section">
              <h2>Profile Information</h2>
              <div className="profile-info">
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Account ID:</strong> {user.id}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
