import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import {
  canAccessPath,
  firstAllowedPath,
  hasPermission,
  type PermissionKey,
} from '@/lib/permissions'

export function ProtectedRoute() {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (user?.role === 'admin' && !canAccessPath(user, location.pathname)) {
    return <Navigate to={firstAllowedPath(user)} replace />
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

export function PermissionRoute({
  permission,
  children,
}: {
  permission: PermissionKey
  children: React.ReactNode
}) {
  const { user, isSchool } = useAuth()
  if (isSchool) {
    return <Navigate to="/my-school" replace />
  }
  if (!hasPermission(user, permission)) {
    return <Navigate to={firstAllowedPath(user)} replace />
  }
  return children
}

export function GuestOnly({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isSchool, user } = useAuth()
  if (isAuthenticated) {
    if (isSchool && user?.schoolId) {
      return <Navigate to={`/my-school`} replace />
    }
    return <Navigate to={firstAllowedPath(user)} replace />
  }
  return children
}
