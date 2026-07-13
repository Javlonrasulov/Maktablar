import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '@/layouts/AppLayout'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { SchoolsPage } from '@/features/schools/SchoolsPage'
import { SchoolDetailPage } from '@/features/schools/SchoolDetailPage'
import { TeachersPage } from '@/features/teachers/TeachersPage'
import { TeacherProfilePage } from '@/features/teachers/TeacherProfilePage'
import { SubjectsPage } from '@/features/subjects/SubjectsPage'
import { WorkloadPage } from '@/features/workload/WorkloadPage'
import { MapPage } from '@/features/map/MapPage'
import { ReportsPage } from '@/features/reports/ReportsPage'
import { SettingsPage } from '@/features/settings/SettingsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'schools', element: <SchoolsPage /> },
      { path: 'schools/:id', element: <SchoolDetailPage /> },
      { path: 'teachers', element: <TeachersPage /> },
      { path: 'teachers/:id', element: <TeacherProfilePage /> },
      { path: 'subjects', element: <SubjectsPage /> },
      { path: 'workload', element: <WorkloadPage /> },
      { path: 'map', element: <MapPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])
