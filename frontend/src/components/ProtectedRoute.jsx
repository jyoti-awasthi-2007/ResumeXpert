import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute() {
  const { loading, user, profile } = useAuth()
  const location = useLocation()

  if (loading) return <div className="min-h-screen grid place-items-center bg-background text-secondary">Loading your workspace...</div>
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (!profile && location.pathname !== '/profile-setup') return <Navigate to="/profile-setup" replace />
  return <Outlet />
}
