import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('memory_game_user')
    return stored ? JSON.parse(stored) : null
  })

  function signup(username, password) {
    const users = JSON.parse(localStorage.getItem('memory_game_users') || '[]')
    if (users.find(u => u.username === username)) {
      return { success: false, error: 'Username already taken' }
    }
    const newUser = { username, password, createdAt: Date.now() }
    users.push(newUser)
    localStorage.setItem('memory_game_users', JSON.stringify(users))
    const sessionUser = { username }
    localStorage.setItem('memory_game_user', JSON.stringify(sessionUser))
    setUser(sessionUser)
    return { success: true }
  }

  function login(username, password) {
    const users = JSON.parse(localStorage.getItem('memory_game_users') || '[]')
    const found = users.find(u => u.username === username && u.password === password)
    if (!found) {
      return { success: false, error: 'Invalid username or password' }
    }
    const sessionUser = { username }
    localStorage.setItem('memory_game_user', JSON.stringify(sessionUser))
    setUser(sessionUser)
    return { success: true }
  }

  function logout() {
    localStorage.removeItem('memory_game_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
