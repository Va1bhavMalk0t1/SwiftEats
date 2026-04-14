import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Spinner from './Spinner'

// Redirects to /login if not authenticated
export function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth()
  const location = useLocation()

  if (loading) return <Spinner fullPage />
  if (!isLoggedIn) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}

// Redirects to / if user doesn't have required role
export function RoleRoute({ children, role }) {
  const { user, loading, isLoggedIn } = useAuth()
  const location = useLocation()

  if (loading) return <Spinner fullPage />
  if (!isLoggedIn) return <Navigate to="/login" state={{ from: location }} replace />
  if (user?.role !== role) return <Navigate to="/" replace />
  return children
}
