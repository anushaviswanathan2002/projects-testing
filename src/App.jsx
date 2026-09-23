import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Game from './pages/Game';
import Leaderboard from './pages/Leaderboard';
import './pages/Auth.css';

function AppContent() {
  const { user, loading } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' | 'signup'
  const [gameView, setGameView] = useState('game');  // 'game' | 'leaderboard'

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1a2e' }}>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.1rem' }}>Loading…</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="auth-wrapper">
        {authView === 'login' ? (
          <Login onSwitch={() => setAuthView('signup')} />
        ) : (
          <Signup onSwitch={() => setAuthView('login')} />
        )}
      </div>
    );
  }

  if (gameView === 'leaderboard') {
    return <Leaderboard onBack={() => setGameView('game')} />;
  }

  return <Game onLeaderboard={() => setGameView('leaderboard')} />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
