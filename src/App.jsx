import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Navbar from './components/Navbar';
import MemoryGame from './components/game/MemoryGame';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import './styles/global.css';
import './App.css';

function Inner() {
  const { user, loading } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' | 'signup'
  const [page, setPage] = useState('game');

  if (loading) {
    return (
      <div className="splash">
        <span className="splash-logo">🧠</span>
        <span className="spinner" />
      </div>
    );
  }

  if (!user) {
    return authView === 'login'
      ? <Login onSwitch={() => setAuthView('signup')} />
      : <Signup onSwitch={() => setAuthView('login')} />;
  }

  return (
    <>
      <Navbar page={page} setPage={setPage} />
      <main className="main-content">
        {page === 'game'        && <MemoryGame onLeaderboard={() => setPage('leaderboard')} />}
        {page === 'leaderboard' && <Leaderboard />}
        {page === 'profile'     && <Profile />}
      </main>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Inner />
    </AuthProvider>
  );
}
