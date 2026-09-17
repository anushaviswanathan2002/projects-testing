import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTodo } from '../context/TodoContext';
import { TodoItem } from '../components/TodoItem';
import '../styles/TodoList.css';

export const TodoList = () => {
  const [inputValue, setInputValue] = useState('');
  const { user, logout } = useAuth();
  const { todos, addTodo } = useTodo();
  const navigate = useNavigate();

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addTodo(inputValue);
      setInputValue('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const completedCount = todos.filter(todo => todo.completed).length;

  return (
    <div className="todo-container">
      <div className="todo-header">
        <div>
          <h1>My To-Do List</h1>
          <p className="welcome">Welcome, {user?.name}!</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      <form onSubmit={handleAddTodo} className="add-todo-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new task..."
          className="todo-input"
        />
        <button type="submit" className="add-btn">Add Task</button>
      </form>

      <div className="todo-stats">
        <span>{todos.length} total</span>
        <span>{completedCount} completed</span>
        <span>{todos.length - completedCount} remaining</span>
      </div>

      <div className="todo-list">
        {todos.length === 0 ? (
          <p className="empty-message">No tasks yet. Add one to get started!</p>
        ) : (
          todos.map(todo => (
            <TodoItem key={todo.id} todo={todo} />
          ))
        )}
      </div>
    </div>
  );
};
