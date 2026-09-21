import './TodoItem.css'

function TodoItem({ todo, onDelete, onToggle }) {
  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        className="todo-checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <div className="todo-content">
        <p className="todo-text">{todo.text}</p>
        <span className="todo-time">{todo.createdAt}</span>
      </div>
      <button
        className="delete-btn"
        onClick={() => onDelete(todo.id)}
        aria-label="Delete todo"
      >
        ✕
      </button>
    </div>
  )
}

export default TodoItem
