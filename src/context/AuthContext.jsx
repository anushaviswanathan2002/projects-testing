import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as auth from '../lib/auth.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => auth.getCurrentUser())
  const [hydrated, setHydrated] = useState(true)

  useEffect(() => {
    setUser(auth.getCurrentUser())
    setHydrated(true)
  }, [])

  const handleSignup = useCallback(async (username, password) => {
    const result = await auth.signup(username, password)
    if (result.ok) setUser(result.user)
    return result
  }, [])

  const handleLogin = useCallback(async (username, password) => {
    const result = await auth.login(username, password)
    if (result.ok) setUser(result.user)
    return result
  }, [])

  const handleLogout = useCallback(() => {
    auth.logout()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      hydrated,
      login: handleLogin,
      signup: handleSignup,
      logout: handleLogout,
    }),
    [user, hydrated, handleLogin, handleSignup, handleLogout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
