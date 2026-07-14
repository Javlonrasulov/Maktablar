import type { ReactNode } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '@/layouts/AppLayout'
import { ProtectedRoute, GuestOnly, PermissionRoute } from '@/components/ProtectedRoute'
import { LoginPage } from '@/features/auth/LoginPage'
import { HomePage } from '@/features/dashboard/HomePage'
import { SchoolsPage } from '@/features/schools/SchoolsPage'
import { SchoolDetailPage } from '@/features/schools/SchoolDetailPage'
import { SchoolWorkspacePage } from '@/features/schools/SchoolWorkspacePage'
import { TeachersPage } from '@/features/teachers/TeachersPage'
import { TeacherProfilePage } from '@/features/teachers/TeacherProfilePage'
import { SubjectsPage } from '@/features/subjects/SubjectsPage'
import { WorkloadPage } from '@/features/workload/WorkloadPage'
import { MapPage } from '@/features/map/MapPage'
import { SystemUsersPage } from '@/features/system-users/SystemUsersPage'
import type { PermissionKey } from '@/lib/permissions'

function withPermission(permission: PermissionKey, page: ReactNode) {
  return <PermissionRoute permission={permission}>{page}</PermissionRoute>
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <GuestOnly>
        <LoginPage />
      </GuestOnly>
    ),
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: withPermission('dashboard', <HomePage />) },
          { path: 'schools', element: withPermission('schools', <SchoolsPage />) },
          { path: 'schools/:id', element: withPermission('schools', <SchoolDetailPage />) },
          { path: 'my-school', element: <SchoolWorkspacePage /> },
          { path: 'teachers', element: withPermission('teachers', <TeachersPage />) },
          { path: 'teachers/:id', element: withPermission('teachers', <TeacherProfilePage />) },
          { path: 'subjects', element: withPermission('subjects', <SubjectsPage />) },
          { path: 'workload', element: withPermission('workload', <WorkloadPage />) },
          { path: 'map', element: withPermission('map', <MapPage />) },
          { path: 'system-users', element: withPermission('systemUsers', <SystemUsersPage />) },
          { path: 'settings', element: <Navigate to="/system-users" replace /> },
          { path: '*', element: <Navigate to="/" replace /> },
        ],
      },
    ],
  },
])
