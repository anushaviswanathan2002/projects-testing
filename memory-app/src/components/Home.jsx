import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Home.css';

export default function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>🎮 Memory Game</h1>
        <p className="tagline">Test your memory skills!</p>

        {user ? (
          <div className="user-section">
            <p className="greeting">Welcome back, {user.username}!</p>
            <button className="btn btn-primary" onClick={() => navigate('/game')}>
              Play Game
            </button>
          </div>
        ) : (
          <div className="auth-section">
            <p>Sign in to play the game and track your scores.</p>
            <div className="button-group">
              <button className="btn btn-primary" onClick={() => navigate('/login')}>
                Login
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/signup')}>
                Sign Up
              </button>
            </div>
          </div>
        )}

        <div className="features">
          <h2>Features</h2>
          <ul>
            <li>✨ Three difficulty levels</li>
            <li>🎯 Track your moves</li>
            <li>🏆 Challenge yourself</li>
            <li>👤 User authentication</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
