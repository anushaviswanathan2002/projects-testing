import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TodoList.css';

function TodoList({ currentUser, onLogout }) {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const userTodos = localStorage.getItem(`todos_${currentUser.id}`);
    if (userTodos) {
      setTodos(JSON.parse(userTodos));
    }
  }, [currentUser.id]);

  const saveTodos = (newTodos) => {
    setTodos(newTodos);
    localStorage.setItem(`todos_${currentUser.id}`, JSON.stringify(newTodos));
  };

  const addTodo = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const newTodo = {
        id: Date.now(),
        text: input,
        completed: false,
        createdAt: new Date().toLocaleString(),
      };
      saveTodos([...todos, newTodo]);
      setInput('');
    }
  };

  const toggleTodo = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos(updatedTodos);
  };

  const deleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    saveTodos(updatedTodos);
  };

  const getFilteredTodos = () => {
    switch (filter) {
      case 'completed':
        return todos.filter((t) => t.completed);
      case 'pending':
        return todos.filter((t) => !t.completed);
      default:
        return todos;
    }
  };

  const filteredTodos = getFilteredTodos();
  const completedCount = todos.filter((t) => t.completed).length;

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="todo-app">
      <div className="header">
        <h1>To-Do List</h1>
        <div className="user-info">
          <span>Welcome, {currentUser?.name}!</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="todo-container">
        <div className="stats">
          <p>Total: {todos.length} | Completed: {completedCount} | Pending: {todos.length - completedCount}</p>
        </div>

        <form onSubmit={addTodo} className="input-form">
          <input
            type="text"
            placeholder="Add a new task..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">Add Task</button>
        </form>

        <div className="filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>

        <div className="todo-list">
          {filteredTodos.length === 0 ? (
            <p className="empty-message">
              {filter === 'all' && 'No tasks yet. Add one to get started!'}
              {filter === 'pending' && 'All tasks completed! 🎉'}
              {filter === 'completed' && 'No completed tasks yet.'}
            </p>
          ) : (
            filteredTodos.map((todo) => (
              <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                <div className="todo-content">
                  <p className="todo-text">{todo.text}</p>
                  <span className="todo-date">{todo.createdAt}</span>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default TodoList;
