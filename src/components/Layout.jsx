import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { DataProvider } from '../context/DataContext.jsx'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <DataProvider userId={user.id}>
      <div className="app-shell">
        <header className="topbar">
          <div className="brand">
            <span className="brand-mark">M&amp;T</span>
            <span className="brand-name">Memory &amp; Todo</span>
          </div>
          <nav className="nav">
            <NavLink to="/" end>
              Dashboard
            </NavLink>
            <NavLink to="/memories">Memories</NavLink>
            <NavLink to="/todos">Todos</NavLink>
          </nav>
          <div className="user-area">
            <span className="user-name">@{user.username}</span>
            <button className="btn btn-ghost" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </header>
        <main className="main">
          <Outlet />
        </main>
      </div>
    </DataProvider>
  )
}
