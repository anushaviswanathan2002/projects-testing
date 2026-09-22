import React from 'react';
import MemoryGame from './MemoryGame';
import Stopwatch from './Stopwatch';

function Dashboard({ user, onLogout }) {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user.username}! 🎮</h1>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
      <div className="dashboard-content">
        <MemoryGame userId={user.userId} />
        <Stopwatch />
      </div>
    </div>
  );
}

export default Dashboard;
