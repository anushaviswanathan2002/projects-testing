import { createContext, useContext, useState, useEffect } from 'react'

const DataContext = createContext(null)

function key(userId, type) {
  return `memory-todo:${userId}:${type}`
}

function read(userId, type) {
  try {
    const raw = localStorage.getItem(key(userId, type))
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function write(userId, type, items) {
  localStorage.setItem(key(userId, type), JSON.stringify(items))
}

export function DataProvider({ userId, children }) {
  const [memories, setMemories] = useState(() => read(userId, 'memories'))
  const [todos, setTodos] = useState(() => read(userId, 'todos'))

  useEffect(() => {
    setMemories(read(userId, 'memories'))
    setTodos(read(userId, 'todos'))
  }, [userId])

  useEffect(() => {
    write(userId, 'memories', memories)
  }, [userId, memories])

  useEffect(() => {
    write(userId, 'todos', todos)
  }, [userId, todos])

  function addMemory({ title, body }) {
    const memory = {
      id: crypto.randomUUID(),
      title: title.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    setMemories((prev) => [memory, ...prev])
    return memory
  }

  function deleteMemory(id) {
    setMemories((prev) => prev.filter((m) => m.id !== id))
  }

  function addTodo({ text }) {
    const todo = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    }
    setTodos((prev) => [todo, ...prev])
    return todo
  }

  function toggleTodo(id) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    )
  }

  function deleteTodo(id) {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  function editTodo(id, text) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: text.trim() } : t)),
    )
  }

  function clearCompletedTodos() {
    setTodos((prev) => prev.filter((t) => !t.completed))
  }

  return (
    <DataContext.Provider
      value={{
        memories,
        todos,
        addMemory,
        deleteMemory,
        addTodo,
        toggleTodo,
        deleteTodo,
        editTodo,
        clearCompletedTodos,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used inside DataProvider')
  return ctx
}
