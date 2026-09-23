import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">🃏 Memory Game</div>
      <div className="nav-right">
        {user && (
          <>
            <div className="nav-stats">
              <span title="Games Played">🎮 {user.stats.gamesPlayed}</span>
              {user.stats.bestMoves !== null && (
                <span title="Best Moves">🏆 {user.stats.bestMoves} moves</span>
              )}
              {user.stats.bestTime !== null && (
                <span title="Best Time">⚡ {fmt(user.stats.bestTime)}</span>
              )}
            </div>
            <div className="nav-avatar">{user.username[0].toUpperCase()}</div>
            <span className="nav-username">{user.username}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Sign out
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

function fmt(s) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}
