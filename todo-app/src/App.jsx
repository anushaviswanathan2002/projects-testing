import { useState } from 'react'
import './App.css'
import ToDoForm from './components/ToDoForm'
import ToDoList from './components/ToDoList'

function App() {
  const [todos, setTodos] = useState([])

  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false
    }
    setTodos([...todos, newTodo])
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const completedCount = todos.filter(todo => todo.completed).length
  const totalCount = todos.length

  return (
    <div className="app">
      <div className="container">
        <h1>My To-Do List</h1>
        <ToDoForm onAddTodo={addTodo} />
        
        {totalCount > 0 && (
          <div className="stats">
            <p>{completedCount} of {totalCount} tasks completed</p>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        <ToDoList 
          todos={todos}
          onToggleTodo={toggleTodo}
          onDeleteTodo={deleteTodo}
        />

        {totalCount === 0 && (
          <div className="empty-state">
            <p>No tasks yet. Add one to get started! 🚀</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
