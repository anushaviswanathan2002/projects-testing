import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

function Profile({ user }) {
  const [stats, setStats] = useState(null);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchGames();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchGames = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/games', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setGames(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch games:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="profile-container"><p>Loading...</p></div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h1>Profile</h1>
          <div className="user-info">
            <div className="user-detail">
              <span className="label">Username:</span>
              <span className="value">{user.username}</span>
            </div>
            <div className="user-detail">
              <span className="label">Email:</span>
              <span className="value">{user.email}</span>
            </div>
          </div>
        </div>

        {stats && (
          <div className="stats-section">
            <h2>Your Statistics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{stats.total_games}</div>
                <div className="stat-name">Total Games</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.games_won}</div>
                <div className="stat-name">Games Won</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.best_moves || '-'}</div>
                <div className="stat-name">Best Score</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">
                  {stats.total_games > 0 ? ((stats.games_won / stats.total_games) * 100).toFixed(0) : 0}%
                </div>
                <div className="stat-name">Win Rate</div>
              </div>
            </div>
          </div>
        )}

        {games.length > 0 && (
          <div className="games-section">
            <h2>Recent Games</h2>
            <div className="games-list">
              {games.map((game, index) => (
                <div key={index} className="game-item">
                  <div className="game-info">
                    <span className="game-number">Game #{games.length - index}</span>
                    <span className={`game-status ${game.completed ? 'won' : 'lost'}`}>
                      {game.completed ? '✓ Won' : '✗ Lost'}
                    </span>
                  </div>
                  <div className="game-stats-row">
                    <span>Moves: {game.moves}</span>
                    <span>Score: {game.score}</span>
                    <span className="game-date">
                      {new Date(game.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {games.length === 0 && (
          <div className="no-games">
            <p>No games played yet. <a href="/game">Start playing now!</a></p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
