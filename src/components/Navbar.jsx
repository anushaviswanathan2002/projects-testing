import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { isAuthenticated, username, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        <span className="brand-mark" aria-hidden>🧠</span>
        <span>Memory</span>
      </Link>

      <div className="nav-links">
        {isAuthenticated ? (
          <>
            <NavLink to="/game">Play</NavLink>
            <NavLink to="/leaderboard">Leaderboard</NavLink>
            <span className="nav-user" title={username}>👤 {username}</span>
            <button className="btn btn-ghost" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signup">Sign up</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}