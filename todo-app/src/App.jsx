import { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext.jsx';
import AuthForm from './components/AuthForm.jsx';
import TodoApp from './components/TodoApp.jsx';

function readRoute() {
  const hash = window.location.hash.replace(/^#/, '') || '/login';
  return hash.startsWith('/signup') ? 'signup' : 'login';
}

export default function App() {
  const { currentUser } = useAuth();
  const [route, setRoute] = useState(readRoute);

  useEffect(() => {
    const onHashChange = () => setRoute(readRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  if (currentUser) return <TodoApp />;

  return (
    <main className="auth-shell">
      <div className="auth-brand">
        <span className="brand-mark">✓</span>
        <span className="brand-name">Tasks</span>
      </div>
      <AuthForm mode={route} />
      <p className="auth-foot">Your tasks are saved locally to your device.</p>
    </main>
  );
}