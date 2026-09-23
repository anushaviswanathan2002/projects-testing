import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Profile.css';

function fmt(s) {
  if (!s && s !== 0) return '--';
  return `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;
}

function Profile({ user, onLogout }) {
  const [stats, setStats] = useState(null);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      axios.get('/api/stats', { headers }).then((r) => setStats(r.data)).catch(() => {}),
      axios.get('/api/games', { headers }).then((r) => setGames(r.data)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  return (
    <div className="profile-wrapper">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-brand">🃏 Memory Game</div>
        <div className="nav-right">
          <Link to="/game" className="nav-link-btn">🎮 Play</Link>
          <div className="nav-avatar">{user.username[0].toUpperCase()}</div>
          <span className="nav-username">{user.username}</span>
          <button className="logout-btn" onClick={onLogout}>Sign out</button>
        </div>
      </nav>

      <main className="profile-main">
        {/* Header */}
        <div className="profile-hero">
          <div className="profile-avatar-lg">{user.username[0].toUpperCase()}</div>
          <div>
            <h1 className="profile-name">{user.username}</h1>
            <p className="profile-email">{user.email}</p>
          </div>
        </div>

        {loading ? (
          <div className="profile-loading"><div className="spinner" /></div>
        ) : (
          <>
            {/* Stats grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🎮</div>
                <div className="stat-number">{stats?.total_games ?? 0}</div>
                <div className="stat-name">Games Played</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🏆</div>
                <div className="stat-number">{stats?.games_won ?? 0}</div>
                <div className="stat-name">Games Won</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-number">{stats?.best_moves ?? '--'}</div>
                <div className="stat-name">Best Moves</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-number">{stats?.best_score ?? '--'}</div>
                <div className="stat-name">Best Score</div>
              </div>
            </div>

            {/* Recent games */}
            {games.length > 0 && (
              <div className="games-section">
                <h2 className="section-title">Recent Games</h2>
                <div className="games-list">
                  {games.slice(0, 10).map((game, i) => (
                    <div key={i} className="game-row">
                      <div className="game-row-left">
                        <span className={`game-badge ${game.completed ? 'won' : 'lost'}`}>
                          {game.completed ? '✓ Won' : '✗ Lost'}
                        </span>
                        <span className="game-date">
                          {new Date(game.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="game-row-right">
                        <span className="game-meta">🎯 {game.moves} moves</span>
                        <span className="game-meta">⭐ {game.score} pts</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Profile;
