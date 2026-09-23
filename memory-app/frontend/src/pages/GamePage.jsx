import React, { useState, useEffect } from 'react';
import MemoryGame from '../components/MemoryGame';
import UserProfile from '../components/UserProfile';
import '../styles/GamePage.css';

export default function GamePage({ username, token, onLogout }) {
  const [profile, setProfile] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetchProfile();
    fetchLeaderboard();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setProfile(await response.json());
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('http://localhost:5000/scores/leaderboard');
      if (response.ok) {
        setLeaderboard(await response.json());
      }
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    }
  };

  const handleGameComplete = (score) => {
    fetchProfile();
    fetchLeaderboard();
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>🎮 Memory Game</h1>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>

      <div className="game-content">
        <div className="game-main">
          {profile && (
            <UserProfile profile={profile} username={username} />
          )}
          <MemoryGame
            token={token}
            username={username}
            onGameComplete={handleGameComplete}
          />
        </div>

        <div className="leaderboard">
          <h2>🏆 Leaderboard</h2>
          <div className="leaderboard-list">
            {leaderboard.length === 0 ? (
              <p>No scores yet</p>
            ) : (
              leaderboard.map((entry, index) => (
                <div
                  key={index}
                  className={`leaderboard-entry ${
                    entry.username === username ? 'highlighted' : ''
                  }`}
                >
                  <span className="rank">#{index + 1}</span>
                  <span className="username">{entry.username}</span>
                  <span className="score">{entry.bestScore}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
