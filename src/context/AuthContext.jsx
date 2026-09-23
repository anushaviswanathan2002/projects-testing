import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('memory_current_user')
    if (stored) setUser(JSON.parse(stored))
    setLoading(false)
  }, [])

  const getUsers = () => {
    const raw = localStorage.getItem('memory_users')
    return raw ? JSON.parse(raw) : {}
  }

  const saveUsers = (users) => {
    localStorage.setItem('memory_users', JSON.stringify(users))
  }

  const signUp = (username, password) => {
    const users = getUsers()
    if (users[username]) {
      return { error: 'Username already exists. Please choose a different one.' }
    }
    const newUser = {
      username,
      password, // In a real app, use hashed passwords
      createdAt: new Date().toISOString(),
      stats: { gamesPlayed: 0, bestScore: null, totalMoves: 0 },
      scores: [],
    }
    users[username] = newUser
    saveUsers(users)
    const publicUser = { username, stats: newUser.stats, scores: newUser.scores }
    localStorage.setItem('memory_current_user', JSON.stringify(publicUser))
    setUser(publicUser)
    return { success: true }
  }

  const login = (username, password) => {
    const users = getUsers()
    const found = users[username]
    if (!found) return { error: 'No account found with that username.' }
    if (found.password !== password) return { error: 'Incorrect password.' }
    const publicUser = { username: found.username, stats: found.stats, scores: found.scores }
    localStorage.setItem('memory_current_user', JSON.stringify(publicUser))
    setUser(publicUser)
    return { success: true }
  }

  const logout = () => {
    localStorage.removeItem('memory_current_user')
    setUser(null)
  }

  const saveScore = (scoreData) => {
    const users = getUsers()
    const u = users[user.username]
    if (!u) return
    u.scores = [scoreData, ...(u.scores || [])].slice(0, 10)
    u.stats.gamesPlayed = (u.stats.gamesPlayed || 0) + 1
    u.stats.totalMoves  = (u.stats.totalMoves  || 0) + scoreData.moves
    if (u.stats.bestScore === null || scoreData.moves < u.stats.bestScore) {
      u.stats.bestScore = scoreData.moves
    }
    users[user.username] = u
    saveUsers(users)
    const publicUser = { username: u.username, stats: u.stats, scores: u.scores }
    localStorage.setItem('memory_current_user', JSON.stringify(publicUser))
    setUser(publicUser)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, login, logout, saveScore }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
