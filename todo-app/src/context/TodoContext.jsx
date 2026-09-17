import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const TodoContext = createContext(null);

export const TodoProvider = ({ children }) => {
  const { user } = useAuth();
  const [todos, setTodos] = useState([]);

  // Load todos from localStorage when user changes
  useEffect(() => {
    if (user) {
      const userTodos = JSON.parse(localStorage.getItem(`todos_${user.id}`) || '[]');
      setTodos(userTodos);
    } else {
      setTodos([]);
    }
  }, [user]);

  const addTodo = (text) => {
    if (!user) return;
    const newTodo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    localStorage.setItem(`todos_${user.id}`, JSON.stringify(updatedTodos));
  };

  const toggleTodo = (id) => {
    if (!user) return;
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    localStorage.setItem(`todos_${user.id}`, JSON.stringify(updatedTodos));
  };

  const deleteTodo = (id) => {
    if (!user) return;
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
    localStorage.setItem(`todos_${user.id}`, JSON.stringify(updatedTodos));
  };

  const editTodo = (id, newText) => {
    if (!user) return;
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    );
    setTodos(updatedTodos);
    localStorage.setItem(`todos_${user.id}`, JSON.stringify(updatedTodos));
  };

  return (
    <TodoContext.Provider value={{ todos, addTodo, toggleTodo, deleteTodo, editTodo }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo must be used within TodoProvider');
  }
  return context;
};
