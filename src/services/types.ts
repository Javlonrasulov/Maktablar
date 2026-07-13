export type SchoolStatus = 'normal' | 'shortage' | 'overload' | 'problem'
export type TeacherStatus = 'active' | 'vacation' | 'inactive'
export type UserRole = 'district_admin' | 'school_director' | 'operator' | 'admin'
export type WorkloadBand = 'under18' | 'h18' | 'h24' | 'h30' | 'over40'

export interface School {
  id: string
  number: number
  name: string
  director: string
  phone: string
  teachersCount: number
  studentsCount: number
  subjectsCount: number
  weeklyHours: number
  vacantHours: number
  status: SchoolStatus
  lat: number
  lng: number
  logo?: string
  updatedAt: string
  hasData: boolean
}

export interface Teacher {
  id: string
  fullName: string
  phone: string
  specialty: string
  category: string
  experienceYears: number
  schoolId: string
  schoolName: string
  subjects: string[]
  weeklyHours: number
  status: TeacherStatus
  avatar?: string
  classes: string[]
  schools: string[]
}

export interface SubjectStat {
  id: string
  name: string
  teachersCount: number
  totalHours: number
  vacantHours: number
  overloadHours: number
  topSchool: string
}

export interface NotificationItem {
  id: string
  type: 'update' | 'vacancy' | 'workload' | 'alert'
  schoolNumber: number
  messageKey: string
  createdAt: string
  read: boolean
}

export interface AiInsight {
  id: string
  type: 'shortage' | 'overload' | 'vacancy' | 'stale'
  titleKey: string
  detailKey: string
  params?: Record<string, string | number>
  severity: 'info' | 'warning' | 'critical'
}

export interface DashboardKpis {
  totalSchools: number
  totalTeachers: number
  totalStudents: number
  totalWeeklyHours: number
  vacantHours: number
  mostLoadedSubject: string
  leastLoadedSubject: string
  updatedToday: number
  noDataSchools: number
}

export interface ChartBundle {
  monthlyHours: { month: string; hours: number }[]
  teachersTrend: { month: string; count: number }[]
  statusDonut: { name: string; value: number }[]
  subjectBars: { subject: string; hours: number }[]
  radarMetrics: { metric: string; value: number }[]
  treemap: { name: string; value: number }[]
  heatmap: number[][]
  sankey: {
    nodes: { name: string }[]
    links: { source: number; target: number; value: number }[]
  }
}
