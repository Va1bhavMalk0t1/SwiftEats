import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // true while checking stored token

  // ─── Auto-login on mount ──────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token || token === "undefined" || token === "null") {
  localStorage.removeItem("token")
  setLoading(false)
  return
}
    authAPI.getUser()
      .then((res) => {
        // Backend returns { success, user } or just the user object
        setUser(res.data.user ?? res.data)
      })
      .catch(() => {
        localStorage.removeItem('token')
      })
      .finally(() => setLoading(false))
  }, [])

  // ─── Listen for token expiry events ──────────────────────────────────────
  useEffect(() => {
    const handle = () => { setUser(null) }
    window.addEventListener('auth:expired', handle)
    return () => window.removeEventListener('auth:expired', handle)
  }, [])

  // ─── Login ────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const signRes = await authAPI.signin({ email, password })
    const { token } = signRes.data
    localStorage.setItem('token', token)
    const userRes = await authAPI.getUser()
    const userData = userRes.data.user ?? userRes.data
    setUser(userData)
    return userData
  }, [])

  // ─── Signup ───────────────────────────────────────────────────────────────
  const signup = useCallback(async (data) => {
    await authAPI.signup(data)
  }, [])

  // ─── Logout ───────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setUser(null)
  }, [])

  const isAdmin = user?.role === 'admin'
  const isOwner = user?.role === 'owner'
  const isLoggedIn = !!user

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isAdmin, isOwner, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
