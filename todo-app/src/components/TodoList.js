import TodoItem from './TodoItem';
import './TodoList.css';

function TodoList({ todos, onDelete, onToggle }) {
  return (
    <div className="todo-list">
      {todos.length === 0 ? (
        <p className="empty-message">No tasks yet. Add one to get started!</p>
      ) : (
        <ul>
          {todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={onDelete}
              onToggle={onToggle}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default TodoList;
