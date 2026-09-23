import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <Link to={user ? '/game' : '/login'} className="navbar-brand">
        🧠 Memory Game
      </Link>
      {user && (
        <div className="navbar-right">
          <div className="navbar-user">
            <span className="avatar">{user.username[0].toUpperCase()}</span>
            <span className="username">{user.username}</span>
            {user.gamesPlayed > 0 && (
              <span className="games-played">{user.gamesPlayed} game{user.gamesPlayed !== 1 ? 's' : ''}</span>
            )}
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
}
