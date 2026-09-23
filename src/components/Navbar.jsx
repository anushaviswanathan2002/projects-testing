import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <span className="brand-logo" aria-hidden>🧠</span>
        <span>Memory</span>
      </Link>
      <div className="links">
        {currentUser ? (
          <>
            <span className="user-pill" title="Signed in">
              <span className="dot" />
              <span>{currentUser.username}</span>
            </span>
            <button className="btn ghost small" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn ghost small" style={{ textDecoration: 'none' }}>
              Log in
            </Link>
            <Link to="/signup" className="btn small" style={{ textDecoration: 'none' }}>
              Sign up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}