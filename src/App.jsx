import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import GamePage from './pages/GamePage';
import { useState } from 'react';

function AppRoutes() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState('dashboard'); // 'dashboard' | 'game'

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  if (!user) return <AuthPage />;

  if (page === 'game') return <GamePage onExit={() => setPage('dashboard')} />;

  return <Dashboard onPlay={() => setPage('game')} />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
