export type SchoolStatus = 'normal' | 'shortage' | 'overload' | 'problem'
export type TeacherStatus = 'active' | 'vacation' | 'inactive'
export type UserRole = 'admin' | 'school'
export type WorkloadBand = 'under18' | 'h18' | 'h24' | 'h30' | 'over40'

export interface School {
  id: string
  number: number
  name: string
  director: string
  phone: string
  address: string
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
  login: string
  /** Demo only — real apps must never store plain passwords */
  password: string
  subjectsList: string
  classesList: string
  vacancies: string
  schedule: string
  workloadsNote: string
  profileComplete: boolean
}

export interface TeacherAssignment {
  id: string
  className: string
  subject: string
  hours: number
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
  /** Sinf + fan + haftalik soat yuklamalari */
  assignments: TeacherAssignment[]
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

export interface AuthUser {
  id: string
  login: string
  role: UserRole
  displayName: string
  schoolId?: string
  jobRole?: string
  permissions?: string[]
}

export interface CreateSchoolInput {
  name: string
  login: string
  password: string
}

export type SchoolProfileInput = Omit<
  School,
  'id' | 'number' | 'login' | 'password' | 'name' | 'updatedAt' | 'hasData' | 'profileComplete' | 'logo'
> & {
  name?: string
}
