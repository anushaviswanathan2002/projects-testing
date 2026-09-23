import React, { useState, useEffect } from 'react';
import '../styles/Todo.css';

function Todo() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, completed

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (inputValue.trim() === '') {
      alert('Please enter a todo item');
      return;
    }

    const newTodo = {
      id: Date.now(),
      text: inputValue,
      completed: false,
      createdAt: new Date().toLocaleDateString()
    };

    setTodos([newTodo, ...todos]);
    setInputValue('');
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const getFilteredTodos = () => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const filteredTodos = getFilteredTodos();
  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;

  return (
    <div className="todo-container">
      <div className="todo-header">
        <h2>📝 My To-Do List</h2>
        <p className="todo-stats">
          Active: <span>{activeCount}</span> | Completed: <span>{completedCount}</span>
        </p>
      </div>

      <div className="todo-input-section">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new todo item..."
          className="todo-input"
        />
        <button onClick={addTodo} className="btn-add-todo">
          Add Todo
        </button>
      </div>

      <div className="todo-filter">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({todos.length})
        </button>
        <button
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active ({activeCount})
        </button>
        <button
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed ({completedCount})
        </button>
      </div>

      <div className="todo-list">
        {filteredTodos.length === 0 ? (
          <div className="todo-empty">
            <p>
              {filter === 'all' && todos.length === 0
                ? '✨ No todos yet. Add one to get started!'
                : `No ${filter} todos.`}
            </p>
          </div>
        ) : (
          filteredTodos.map(todo => (
            <div
              key={todo.id}
              className={`todo-item ${todo.completed ? 'completed' : ''}`}
            >
              <div className="todo-checkbox-section">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo.id)}
                  className="todo-checkbox"
                />
                <div className="todo-text-section">
                  <span className="todo-text">{todo.text}</span>
                  <span className="todo-date">{todo.createdAt}</span>
                </div>
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="btn-delete-todo"
                title="Delete todo"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {completedCount > 0 && (
        <div className="todo-footer">
          <button onClick={clearCompleted} className="btn-clear-completed">
            Clear Completed Tasks
          </button>
        </div>
      )}
    </div>
  );
}

export default Todo;
