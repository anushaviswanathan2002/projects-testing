import { useEffect, useMemo, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'todo-app:items'
const FILTERS = ['all', 'active', 'completed']

function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default function App() {
  const [items, setItems] = useState(loadItems)
  const [draft, setDraft] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const visible = useMemo(() => {
    if (filter === 'active') return items.filter((i) => !i.done)
    if (filter === 'completed') return items.filter((i) => i.done)
    return items
  }, [items, filter])

  const remaining = items.filter((i) => !i.done).length

  function addItem(e) {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    setItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text, done: false },
    ])
    setDraft('')
  }

  function toggleItem(id) {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i))
    )
  }

  function deleteItem(id) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function clearCompleted() {
    setItems((prev) => prev.filter((i) => !i.done))
  }

  return (
    <div className="app">
      <div className="card">
        <header className="header">
          <div>
            <h1>Todos</h1>
            <p className="subtitle">
              {remaining} {remaining === 1 ? 'task' : 'tasks'} remaining
            </p>
          </div>
        </header>

        <form className="form" onSubmit={addItem}>
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="What needs to be done?"
            aria-label="New todo"
          />
          <button type="submit">Add</button>
        </form>

        <div className="controls">
          <div className="filters" role="tablist">
            {FILTERS.map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={filter === f}
                className={filter === f ? 'active' : ''}
                onClick={() => setFilter(f)}
              >
                {f[0].toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <button
            className="clear-btn"
            onClick={clearCompleted}
            disabled={!items.some((i) => i.done)}
          >
            Clear completed
          </button>
        </div>

        {visible.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">📝</div>
            {items.length === 0
              ? 'No todos yet. Add your first one above.'
              : 'Nothing to show here.'}
          </div>
        ) : (
          <ul className="list">
            {visible.map((item) => (
              <li
                key={item.id}
                className={`item${item.done ? ' completed' : ''}`}
              >
                <button
                  className={`checkbox${item.done ? ' checked' : ''}`}
                  onClick={() => toggleItem(item.id)}
                  aria-label={
                    item.done ? 'Mark as active' : 'Mark as completed'
                  }
                />
                <span className="text">{item.text}</span>
                <button
                  className="delete-btn"
                  onClick={() => deleteItem(item.id)}
                  aria-label="Delete todo"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}