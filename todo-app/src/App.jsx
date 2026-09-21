import { useState } from 'react'
import './App.css'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'

function App() {
  const [todos, setTodos] = useState([])
  const [filter, setFilter] = useState('all')

  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date().toLocaleString()
    }
    setTodos([newTodo, ...todos])
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const toggleComplete = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const getFilteredTodos = () => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed)
      case 'completed':
        return todos.filter(todo => todo.completed)
      default:
        return todos
    }
  }

  const filteredTodos = getFilteredTodos()
  const completedCount = todos.filter(todo => todo.completed).length
  const activeCount = todos.filter(todo => !todo.completed).length

  return (
    <div className="app">
      <div className="app-container">
        <header className="app-header">
          <h1>My To-Do List</h1>
          <p className="subtitle">Stay organized and productive</p>
        </header>

        <TodoForm onAdd={addTodo} />

        <div className="stats">
          <div className="stat-item">
            <span className="stat-label">Total:</span>
            <span className="stat-value">{todos.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Active:</span>
            <span className="stat-value active">{activeCount}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Completed:</span>
            <span className="stat-value completed">{completedCount}</span>
          </div>
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>

        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            <p>
              {filter === 'all' && "No todos yet. Add one to get started!"}
              {filter === 'active' && "All caught up! No active tasks."}
              {filter === 'completed' && "No completed tasks yet."}
            </p>
          </div>
        ) : (
          <TodoList
            todos={filteredTodos}
            onDelete={deleteTodo}
            onToggle={toggleComplete}
          />
        )}

        {todos.length > 0 && (
          <button
            className="clear-btn"
            onClick={() => setTodos(todos.filter(todo => !todo.completed))}
          >
            Clear Completed
          </button>
        )}
      </div>
    </div>
  )
}

export default App
