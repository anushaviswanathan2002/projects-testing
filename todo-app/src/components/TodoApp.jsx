import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const TASKS_KEY_PREFIX = 'todoapp.tasks.';

function tasksKey(username) {
  return `${TASKS_KEY_PREFIX}${username}`;
}

function loadTasks(username) {
  try {
    const raw = localStorage.getItem(tasksKey(username));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function TodoApp() {
  const { currentUser, logout } = useAuth();
  const [tasks, setTasks] = useState(() => loadTasks(currentUser.username));
  const [draft, setDraft] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setTasks(loadTasks(currentUser.username));
  }, [currentUser.username]);

  useEffect(() => {
    localStorage.setItem(tasksKey(currentUser.username), JSON.stringify(tasks));
  }, [tasks, currentUser.username]);

  const addTask = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setTasks((prev) => [
      ...prev,
      { id: newId(), text, done: false, createdAt: Date.now() },
    ]);
    setDraft('');
  };

  const toggleTask = (id) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((t) => !t.done));
  };

  const filtered = useMemo(() => {
    if (filter === 'active') return tasks.filter((t) => !t.done);
    if (filter === 'done') return tasks.filter((t) => t.done);
    return tasks;
  }, [tasks, filter]);

  const remaining = tasks.filter((t) => !t.done).length;
  const completed = tasks.length - remaining;

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="app-brand">
          <span className="brand-mark">✓</span>
          <h1 className="app-name">Tasks</h1>
        </div>
        <div className="user-bar">
          <span className="user-greeting">Hi, <strong>{currentUser.username}</strong></span>
          <button type="button" className="btn btn-ghost" onClick={logout}>Log out</button>
        </div>
      </header>

      <section className="todo-card">
        <form className="todo-form" onSubmit={addTask}>
          <input
            className="todo-input"
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add a new task and press Enter…"
          />
          <button type="submit" className="btn btn-primary">Add</button>
        </form>

        <div className="todo-toolbar">
          <div className="filters" role="tablist" aria-label="Filter tasks">
            {[
              { key: 'all', label: 'All' },
              { key: 'active', label: 'Active' },
              { key: 'done', label: 'Done' },
            ].map((f) => (
              <button
                key={f.key}
                role="tab"
                aria-selected={filter === f.key}
                className={`filter-btn${filter === f.key ? ' active' : ''}`}
                onClick={() => setFilter(f.key)}
                type="button"
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="counts">
            <span>{remaining} active</span>
            <span>{completed} done</span>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            {tasks.length === 0
              ? 'Nothing here yet. Add your first task above.'
              : 'No tasks match this filter.'}
          </div>
        ) : (
          <ul className="todo-list">
            {filtered.map((task) => (
              <li key={task.id} className={`todo-item${task.done ? ' done' : ''}`}>
                <label className="todo-check">
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => toggleTask(task.id)}
                  />
                  <span className="check-box" aria-hidden="true" />
                </label>
                <span className="todo-text">{task.text}</span>
                <button
                  type="button"
                  className="btn btn-danger-ghost"
                  onClick={() => deleteTask(task.id)}
                  aria-label={`Delete task: ${task.text}`}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}

        {completed > 0 && (
          <div className="todo-footer">
            <button type="button" className="btn btn-link" onClick={clearCompleted}>
              Clear completed ({completed})
            </button>
          </div>
        )}
      </section>

      <p className="app-foot">Tasks are stored locally under your account on this device.</p>
    </main>
  );
}