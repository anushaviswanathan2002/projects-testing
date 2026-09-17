import { useState } from 'react';
import './App.css';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';

function App() {
  const [todos, setTodos] = useState([]);

  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
    };
    setTodos([newTodo, ...todos]);
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const completedCount = todos.filter(todo => todo.completed).length;

  return (
    <div className="App">
      <div className="todo-container">
        <h1 className="todo-title">My To-Do List</h1>
        
        <div className="stats">
          <span className="stat">Total: {todos.length}</span>
          <span className="stat">Completed: {completedCount}</span>
        </div>

        <TodoForm onAddTodo={addTodo} />
        
        {todos.length === 0 ? (
          <div className="empty-state">
            <p>No tasks yet. Add one to get started! 🚀</p>
          </div>
        ) : (
          <TodoList 
            todos={todos}
            onToggleTodo={toggleTodo}
            onDeleteTodo={deleteTodo}
          />
        )}
      </div>
    </div>
  );
}

export default App;
