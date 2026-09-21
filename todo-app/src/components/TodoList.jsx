import TodoItem from './TodoItem'
import './TodoList.css'

function TodoList({ todos, onDelete, onToggle }) {
  return (
    <div className="todo-list">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}
    </div>
  )
}

export default TodoList
