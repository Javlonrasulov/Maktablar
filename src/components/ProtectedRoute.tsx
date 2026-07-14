import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, isSchool } = useAuth()
  if (!isAdmin) {
    return <Navigate to={isSchool ? '/my-school' : '/'} replace />
  }
  return children
}

export function GuestOnly({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isSchool, user } = useAuth()
  if (isAuthenticated) {
    if (isSchool && user?.schoolId) {
      return <Navigate to={`/my-school`} replace />
    }
    return <Navigate to="/" replace />
  }
  return children
}
