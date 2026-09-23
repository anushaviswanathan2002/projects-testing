import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar({ page, setPage }) {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => setPage('game')} role="button">
        <span className="nav-logo">🧠</span>
        <span className="nav-title">MemoryMatch</span>
      </div>

      <div className="nav-links">
        <button
          className={`nav-link ${page === 'game' ? 'active' : ''}`}
          onClick={() => setPage('game')}
        >
          Game
        </button>
        <button
          className={`nav-link ${page === 'leaderboard' ? 'active' : ''}`}
          onClick={() => setPage('leaderboard')}
        >
          Leaderboard
        </button>
        <button
          className={`nav-link ${page === 'profile' ? 'active' : ''}`}
          onClick={() => setPage('profile')}
        >
          Profile
        </button>
      </div>

      <div className="nav-user">
        <span className="nav-username">{user?.username}</span>
        <button className="btn btn-ghost btn-sm" onClick={logout}>Sign Out</button>
      </div>
    </nav>
  );
}
