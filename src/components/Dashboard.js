import React, { useState } from 'react';
import Stopwatch from './Stopwatch';
import './Dashboard.css';

function Dashboard({ user, onLogout }) {
  const [showStopwatch, setShowStopwatch] = useState(true);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Memory Stopwatch App</h1>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-email">{user.email}</span>
          </div>
          <button onClick={onLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        {showStopwatch && <Stopwatch />}
      </main>
    </div>
  );
}

export default Dashboard;
