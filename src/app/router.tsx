import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '@/layouts/AppLayout'
import { ProtectedRoute, GuestOnly, AdminRoute } from '@/components/ProtectedRoute'
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
          { index: true, element: <HomePage /> },
          { path: 'schools', element: <SchoolsPage /> },
          { path: 'schools/:id', element: <SchoolDetailPage /> },
          { path: 'my-school', element: <SchoolWorkspacePage /> },
          { path: 'teachers', element: <TeachersPage /> },
          { path: 'teachers/:id', element: <TeacherProfilePage /> },
          {
            path: 'subjects',
            element: (
              <AdminRoute>
                <SubjectsPage />
              </AdminRoute>
            ),
          },
          { path: 'workload', element: <WorkloadPage /> },
          { path: 'map', element: <MapPage /> },
          {
            path: 'system-users',
            element: (
              <AdminRoute>
                <SystemUsersPage />
              </AdminRoute>
            ),
          },
          { path: 'settings', element: <Navigate to="/system-users" replace /> },
          { path: '*', element: <Navigate to="/" replace /> },
        ],
      },
    ],
  },
])
