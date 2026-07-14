import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { DashboardPage } from '@/features/dashboard/DashboardPage'

export function HomePage() {
  const { isSchool } = useAuth()
  if (isSchool) return <Navigate to="/my-school" replace />
  return <DashboardPage />
}
