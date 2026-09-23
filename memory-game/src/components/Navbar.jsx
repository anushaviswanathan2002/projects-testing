import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/navbar.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">🧠 MemoryGame</div>
      {user && (
        <div className="navbar-links">
          <NavLink to="/game" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Play
          </NavLink>
          <NavLink to="/leaderboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Leaderboard
          </NavLink>
        </div>
      )}
      {user ? (
        <div className="navbar-user">
          <span className="nav-username">👤 {user.username}</span>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div className="navbar-user">
          <NavLink to="/login" className="nav-link">Login</NavLink>
          <NavLink to="/signup" className="btn-signup">Sign up</NavLink>
        </div>
      )}
    </nav>
  )
}
