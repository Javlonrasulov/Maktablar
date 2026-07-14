import type {
  AiInsight,
  ChartBundle,
  DashboardKpis,
  NotificationItem,
  SubjectStat,
  Teacher,
} from './types'
import { delay } from '@/lib/utils'
import {
  createSubjectSync,
  getAllTeachersSync,
  getSchoolSync,
  getSchoolsSync,
  getSubjectsSync,
} from './schoolStore'
import type { TeacherAssignment } from './types'

function withAssignments(teacher: Omit<Teacher, 'assignments'> & { assignments?: TeacherAssignment[] }): Teacher {
  if (teacher.assignments?.length) return teacher as Teacher
  const subject = teacher.subjects[0] ?? teacher.specialty
  const hoursEach =
    teacher.classes.length > 0
      ? Math.max(1, Math.round(teacher.weeklyHours / teacher.classes.length))
      : teacher.weeklyHours
  const assignments: TeacherAssignment[] = teacher.classes.map((className, index) => ({
    id: `${teacher.id}-a${index}`,
    className,
    subject,
    hours: hoursEach,
  }))
  return { ...teacher, assignments }
}

const statuses = ['normal', 'shortage', 'overload', 'problem'] as const

/** @deprecated use getSchoolsSync — kept for compatibility */
export const schools = getSchoolsSync()

const handcraftedTeachers: Omit<Teacher, 'assignments'>[] = [
  {
    id: 't1',
    fullName: 'Alimova Dilfuza Raximovna',
    phone: '+998 90 111 22 33',
    specialty: 'Matematika',
    category: 'Oliy',
    experienceYears: 14,
    schoolId: 'school-1',
    schoolName: '1-maktab',
    subjects: ['Matematika', 'Algebra'],
    weeklyHours: 24,
    status: 'active',
    classes: ['5-A', '6-B', '7-A', '9-A'],
    schools: ['1-maktab'],
  },
  {
    id: 't2',
    fullName: 'Qodirov Bobur Anvarovich',
    phone: '+998 90 222 33 44',
    specialty: 'Ingliz tili',
    category: 'Birinchi',
    experienceYears: 8,
    schoolId: 'school-3',
    schoolName: '3-maktab',
    subjects: ['Ingliz tili'],
    weeklyHours: 32,
    status: 'active',
    classes: ['8-A', '8-B', '9-A', '10-A', '11-A'],
    schools: ['3-maktab'],
  },
  {
    id: 't3',
    fullName: 'Saidova Malika Botirovna',
    phone: '+998 91 333 44 55',
    specialty: 'Ona tili',
    category: 'Oliy',
    experienceYears: 19,
    schoolId: 'school-14',
    schoolName: '14-maktab',
    subjects: ['Ona tili', 'Adabiyot'],
    weeklyHours: 42,
    status: 'active',
    classes: ['5-A', '6-A', '7-A', '8-A', '9-A', '10-A'],
    schools: ['14-maktab', '15-maktab'],
  },
  {
    id: 't4',
    fullName: 'Nazarov Jasur',
    phone: '+998 93 444 55 66',
    specialty: 'Informatika',
    category: 'Ikkinchi',
    experienceYears: 5,
    schoolId: 'school-8',
    schoolName: '8-maktab',
    subjects: ['Informatika'],
    weeklyHours: 18,
    status: 'active',
    classes: ['7-B', '8-B', '9-B'],
    schools: ['8-maktab'],
  },
  {
    id: 't5',
    fullName: 'Usmonova Feruza',
    phone: '+998 94 555 66 77',
    specialty: 'Biologiya',
    category: 'Birinchi',
    experienceYears: 11,
    schoolId: 'school-12',
    schoolName: '12-maktab',
    subjects: ['Biologiya'],
    weeklyHours: 28,
    status: 'vacation',
    classes: ['8-A', '9-A', '10-B'],
    schools: ['12-maktab'],
  },
  {
    id: 't6',
    fullName: 'Hakimov Sardor',
    phone: '+998 95 666 77 88',
    specialty: 'Fizika',
    category: 'Oliy',
    experienceYears: 16,
    schoolId: 'school-28',
    schoolName: '28-maktab',
    subjects: ['Fizika', 'Astronomiya'],
    weeklyHours: 36,
    status: 'active',
    classes: ['9-A', '10-A', '11-A', '11-B'],
    schools: ['28-maktab'],
  },
  {
    id: 't7',
    fullName: 'Tursunova Mohira',
    phone: '+998 97 777 88 99',
    specialty: 'Tarix',
    category: 'Birinchi',
    experienceYears: 9,
    schoolId: 'school-18',
    schoolName: '18-maktab',
    subjects: ['Tarix'],
    weeklyHours: 22,
    status: 'active',
    classes: ['7-A', '8-A', '9-B'],
    schools: ['18-maktab'],
  },
  {
    id: 't8',
    fullName: 'Raxmatov Ilhom',
    phone: '+998 98 888 99 00',
    specialty: 'Jismoniy tarbiya',
    category: 'Ikkinchi',
    experienceYears: 6,
    schoolId: 'school-25',
    schoolName: '25-maktab',
    subjects: ['Jismoniy tarbiya'],
    weeklyHours: 30,
    status: 'active',
    classes: ['5-A', '6-A', '7-A', '8-A', '9-A'],
    schools: ['25-maktab'],
  },
]

const teacherSeeds: Array<{
  fullName: string
  specialty: string
  category: string
  experienceYears: number
  schoolNumber: number
  subjects: string[]
  weeklyHours: number
  status: Teacher['status']
  classes: string[]
}> = [
  { fullName: 'Karimova Nilufar', specialty: 'Kimyo', category: 'Oliy', experienceYears: 12, schoolNumber: 7, subjects: ['Kimyo'], weeklyHours: 26, status: 'active', classes: ['8-A', '9-A', '10-A'] },
  { fullName: 'Yusupov Anvar', specialty: 'Geografiya', category: 'Birinchi', experienceYears: 7, schoolNumber: 10, subjects: ['Geografiya'], weeklyHours: 20, status: 'active', classes: ['6-A', '7-B', '8-A'] },
  { fullName: 'Ismoilova Dilnoza', specialty: 'Matematika', category: 'Oliy', experienceYears: 15, schoolNumber: 2, subjects: ['Matematika'], weeklyHours: 28, status: 'active', classes: ['5-A', '6-A', '7-A', '8-A'] },
  { fullName: 'Abdullayev Shohrux', specialty: 'Ingliz tili', category: 'Ikkinchi', experienceYears: 4, schoolNumber: 5, subjects: ['Ingliz tili'], weeklyHours: 24, status: 'active', classes: ['5-B', '6-B', '7-B'] },
  { fullName: 'Norqulova Zuhra', specialty: 'Ona tili', category: 'Birinchi', experienceYears: 10, schoolNumber: 15, subjects: ['Ona tili', 'Adabiyot'], weeklyHours: 30, status: 'active', classes: ['8-A', '9-A', '10-A'] },
  { fullName: 'Ergashev Bekzod', specialty: 'Fizika', category: 'Oliy', experienceYears: 18, schoolNumber: 22, subjects: ['Fizika'], weeklyHours: 34, status: 'active', classes: ['9-A', '10-A', '11-A'] },
  { fullName: 'Xolmatova Sevara', specialty: 'Biologiya', category: 'Birinchi', experienceYears: 9, schoolNumber: 1, subjects: ['Biologiya'], weeklyHours: 22, status: 'vacation', classes: ['7-A', '8-B'] },
  { fullName: 'Tursunov Jamshid', specialty: 'Informatika', category: 'Ikkinchi', experienceYears: 3, schoolNumber: 3, subjects: ['Informatika'], weeklyHours: 16, status: 'active', classes: ['8-A', '9-A'] },
  { fullName: 'Rahimova Madina', specialty: 'Tarix', category: 'Oliy', experienceYears: 13, schoolNumber: 14, subjects: ['Tarix'], weeklyHours: 26, status: 'active', classes: ['8-A', '9-A', '10-B'] },
  { fullName: 'Sattorov Umid', specialty: 'Matematika', category: 'Birinchi', experienceYears: 8, schoolNumber: 18, subjects: ['Matematika', 'Algebra'], weeklyHours: 32, status: 'active', classes: ['9-A', '10-A', '11-A'] },
  { fullName: 'Olimova Shahnoza', specialty: 'Ingliz tili', category: 'Oliy', experienceYears: 11, schoolNumber: 28, subjects: ['Ingliz tili'], weeklyHours: 28, status: 'active', classes: ['7-A', '8-A', '9-A'] },
  { fullName: 'Boqiyev Farhod', specialty: 'Kimyo', category: 'Ikkinchi', experienceYears: 5, schoolNumber: 12, subjects: ['Kimyo'], weeklyHours: 18, status: 'active', classes: ['8-B', '9-B'] },
  { fullName: 'Mirzayeva Gulnora', specialty: 'Ona tili', category: 'Birinchi', experienceYears: 14, schoolNumber: 25, subjects: ['Ona tili'], weeklyHours: 24, status: 'active', classes: ['5-A', '6-A', '7-A'] },
  { fullName: 'Hasanov Aziz', specialty: 'Jismoniy tarbiya', category: 'Ikkinchi', experienceYears: 6, schoolNumber: 20, subjects: ['Jismoniy tarbiya'], weeklyHours: 20, status: 'inactive', classes: ['5-A', '6-A'] },
  { fullName: 'Qodirova Lola', specialty: 'Geografiya', category: 'Oliy', experienceYears: 17, schoolNumber: 8, subjects: ['Geografiya'], weeklyHours: 22, status: 'active', classes: ['8-A', '9-A', '10-A'] },
  { fullName: 'Norboyev Doniyor', specialty: 'Fizika', category: 'Birinchi', experienceYears: 9, schoolNumber: 10, subjects: ['Fizika', 'Astronomiya'], weeklyHours: 30, status: 'active', classes: ['10-A', '11-A', '11-B'] },
  { fullName: 'Saidova Dilbar', specialty: 'Biologiya', category: 'Oliy', experienceYears: 12, schoolNumber: 7, subjects: ['Biologiya'], weeklyHours: 26, status: 'active', classes: ['8-A', '9-A', '10-A'] },
]

export const teachers: Teacher[] = [
  ...handcraftedTeachers.map(withAssignments),
  ...teacherSeeds.map((seed, index) =>
    withAssignments({
      id: `t${index + 9}`,
      fullName: seed.fullName,
      phone: `+998 9${(index % 9) + 0} ${String(100 + index).padStart(3, '0')} ${String(200 + index).padStart(3, '0')} ${String(300 + index).padStart(3, '0')}`,
      specialty: seed.specialty,
      category: seed.category,
      experienceYears: seed.experienceYears,
      schoolId: `school-${seed.schoolNumber}`,
      schoolName: `${seed.schoolNumber}-maktab`,
      subjects: seed.subjects,
      weeklyHours: seed.weeklyHours,
      status: seed.status,
      classes: seed.classes,
      schools: [`${seed.schoolNumber}-maktab`],
    }),
  ),
]

/** @deprecated use getSubjectsSync — kept for chart/search compatibility */
export const subjects: SubjectStat[] = getSubjectsSync()

export const notifications: NotificationItem[] = [
  { id: 'n1', type: 'update', schoolNumber: 18, messageKey: 'notifications.dataEntered', createdAt: '2026-07-13T09:20:00', read: false },
  { id: 'n2', type: 'vacancy', schoolNumber: 12, messageKey: 'notifications.vacancyAdded', createdAt: '2026-07-13T08:45:00', read: false },
  { id: 'n3', type: 'workload', schoolNumber: 25, messageKey: 'notifications.workloadUpdated', createdAt: '2026-07-13T08:10:00', read: true },
  { id: 'n4', type: 'alert', schoolNumber: 8, messageKey: 'notifications.staleData', createdAt: '2026-07-12T16:30:00', read: false },
  { id: 'n5', type: 'update', schoolNumber: 3, messageKey: 'notifications.dataEntered', createdAt: '2026-07-12T14:00:00', read: true },
]

export const aiInsights: AiInsight[] = [
  { id: 'ai1', type: 'shortage', titleKey: 'ai.shortageTitle', detailKey: 'ai.shortageDetail', params: { school: '8-maktab', subject: 'Ingliz tili' }, severity: 'critical' },
  { id: 'ai2', type: 'overload', titleKey: 'ai.overloadTitle', detailKey: 'ai.overloadDetail', params: { teacher: 'Saidova Malika', hours: 42 }, severity: 'warning' },
  { id: 'ai3', type: 'vacancy', titleKey: 'ai.vacancyTitle', detailKey: 'ai.vacancyDetail', params: { subject: 'Informatika', hours: 58 }, severity: 'warning' },
  { id: 'ai4', type: 'stale', titleKey: 'ai.staleTitle', detailKey: 'ai.staleDetail', params: { school: '20-maktab', days: 10 }, severity: 'info' },
]

export function getDashboardKpis(): DashboardKpis {
  const schools = getSchoolsSync()
  const withData = schools.filter((s) => s.hasData)
  const today = new Date().toISOString().slice(0, 10)
  return {
    totalSchools: schools.length,
    totalTeachers: schools.reduce((a, s) => a + s.teachersCount, 0),
    totalStudents: schools.reduce((a, s) => a + s.studentsCount, 0),
    totalWeeklyHours: schools.reduce((a, s) => a + s.weeklyHours, 0),
    vacantHours: schools.reduce((a, s) => a + s.vacantHours, 0),
    mostLoadedSubject: 'Ona tili',
    leastLoadedSubject: 'Informatika',
    updatedToday: withData.filter((s) => s.updatedAt === today).length,
    noDataSchools: schools.filter((s) => !s.hasData || !s.profileComplete).length,
  }
}

export function getCharts(): ChartBundle {
  const schools = getSchoolsSync()
  return {
    monthlyHours: [
      { month: 'Yan', hours: 11800 },
      { month: 'Fev', hours: 12100 },
      { month: 'Mar', hours: 12450 },
      { month: 'Apr', hours: 12600 },
      { month: 'May', hours: 12980 },
      { month: 'Iyn', hours: 13120 },
      { month: 'Iyl', hours: 13440 },
    ],
    teachersTrend: [
      { month: 'Yan', count: 580 },
      { month: 'Fev', count: 588 },
      { month: 'Mar', count: 595 },
      { month: 'Apr', count: 602 },
      { month: 'May', count: 610 },
      { month: 'Iyn', count: 618 },
      { month: 'Iyl', count: 624 },
    ],
    statusDonut: statuses.map((name) => ({
      name,
      value: schools.filter((s) => s.status === name).length,
    })),
    subjectBars: getSubjectsSync()
      .slice(0, 6)
      .map((s) => ({ subject: s.name, hours: s.totalHours })),
    radarMetrics: [
      { metric: 'Yuklama', value: 78 },
      { metric: 'Kadr', value: 64 },
      { metric: 'Maʼlumot', value: 86 },
      { metric: 'Vakansiya', value: 42 },
      { metric: 'Sifat', value: 71 },
      { metric: 'Yangilanish', value: 69 },
    ],
    treemap: schools.map((s) => ({ name: s.name, value: s.weeklyHours || 1 })),
    heatmap: [
      [12, 18, 22, 28, 30, 24, 16],
      [14, 20, 26, 32, 34, 28, 18],
      [10, 16, 20, 24, 26, 22, 14],
      [18, 24, 30, 36, 38, 32, 20],
      [8, 12, 16, 20, 22, 18, 10],
    ],
    sankey: {
      nodes: [
        { name: 'Navbahor' },
        { name: 'Normal' },
        { name: 'Shortage' },
        { name: 'Overload' },
        { name: 'Problem' },
        { name: 'Matematika' },
        { name: 'Tillar' },
        { name: 'Tabiiy' },
      ],
      links: [
        { source: 0, target: 1, value: 6 },
        { source: 0, target: 2, value: 4 },
        { source: 0, target: 3, value: 3 },
        { source: 0, target: 4, value: 2 },
        { source: 1, target: 5, value: 3 },
        { source: 1, target: 6, value: 2 },
        { source: 2, target: 6, value: 3 },
        { source: 3, target: 5, value: 2 },
        { source: 4, target: 7, value: 2 },
      ],
    },
  }
}

export async function fetchSchools() {
  await delay(350)
  return getSchoolsSync()
}

export async function fetchSchool(id: string) {
  await delay(250)
  return getSchoolSync(id)
}

export async function fetchTeachers() {
  await delay(350)
  const stored = getAllTeachersSync()
  const storedIds = new Set(stored.map((t) => t.id))
  return [...stored, ...teachers.filter((t) => !storedIds.has(t.id))]
}

export async function fetchTeacher(id: string) {
  await delay(250)
  return getAllTeachersSync().find((t) => t.id === id) ?? teachers.find((t) => t.id === id) ?? null
}

export async function fetchSchoolTeachers(schoolId: string) {
  await delay(200)
  const stored = getAllTeachersSync().filter((t) => t.schoolId === schoolId)
  if (stored.length) return stored
  return teachers.filter((t) => t.schoolId === schoolId)
}

export async function fetchSubjects() {
  await delay(300)
  return getSubjectsSync()
}

export async function createSubject(name: string) {
  await delay(250)
  return createSubjectSync(name)
}

export async function fetchDashboard() {
  await delay(400)
  const schoolsList = getSchoolsSync()
  return {
    kpis: getDashboardKpis(),
    charts: getCharts(),
    insights: aiInsights,
    schools: schoolsList,
    notifications,
  }
}

export async function globalSearch(query: string) {
  await delay(200)
  const q = query.trim().toLowerCase()
  const schoolsList = getSchoolsSync()
  if (!q) return { schools: [], teachers: [], subjects: [] }
  return {
    schools: schoolsList.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.director.toLowerCase().includes(q) ||
        s.phone.includes(q) ||
        String(s.number).includes(q),
    ),
    teachers: teachers.filter(
      (t) =>
        t.fullName.toLowerCase().includes(q) ||
        t.phone.includes(q) ||
        t.specialty.toLowerCase().includes(q) ||
        t.subjects.some((s) => s.toLowerCase().includes(q)),
    ),
    subjects: getSubjectsSync().filter((s) => s.name.toLowerCase().includes(q)),
  }
}

export function workloadBands(list: Teacher[]) {
  return {
    under18: list.filter((t) => t.weeklyHours < 18),
    h18: list.filter((t) => t.weeklyHours >= 18 && t.weeklyHours < 24),
    h24: list.filter((t) => t.weeklyHours >= 24 && t.weeklyHours < 30),
    h30: list.filter((t) => t.weeklyHours >= 30 && t.weeklyHours < 40),
    over40: list.filter((t) => t.weeklyHours >= 40),
  }
}
