import type {
  AiInsight,
  ChartBundle,
  DashboardKpis,
  NotificationItem,
  School,
  SubjectStat,
  Teacher,
} from './types'
import { delay } from '@/lib/utils'

const statuses: School['status'][] = ['normal', 'shortage', 'overload', 'problem']

function school(
  number: number,
  director: string,
  phone: string,
  teachers: number,
  students: number,
  subjects: number,
  hours: number,
  vacant: number,
  status: School['status'],
  lat: number,
  lng: number,
  updatedAt: string,
  hasData: boolean,
): School {
  return {
    id: `school-${number}`,
    number,
    name: `${number}-maktab`,
    director,
    phone,
    teachersCount: teachers,
    studentsCount: students,
    subjectsCount: subjects,
    weeklyHours: hours,
    vacantHours: vacant,
    status,
    lat,
    lng,
    updatedAt,
    hasData,
  }
}

export const schools: School[] = [
  school(1, 'Karimov Abduvali', '+998 93 511 01 01', 42, 680, 18, 980, 12, 'normal', 40.1582, 65.3781, '2026-07-13', true),
  school(2, 'Rakhimova Dilnoza', '+998 93 511 02 02', 38, 620, 17, 910, 28, 'shortage', 40.1621, 65.3712, '2026-07-12', true),
  school(3, 'Toshpulatov Jasur', '+998 93 511 03 03', 51, 840, 19, 1180, 8, 'overload', 40.1554, 65.3855, '2026-07-13', true),
  school(4, 'Axmedova Dilbar', '+998 93 511 04 04', 37, 590, 17, 870, 24, 'shortage', 40.1605, 65.3750, '2026-07-11', true),
  school(5, 'Nurmatova Sevara', '+998 93 511 05 05', 34, 540, 16, 780, 40, 'shortage', 40.1688, 65.3620, '2026-07-10', true),
  school(6, 'Qodirov Anvar', '+998 93 511 06 06', 41, 670, 18, 960, 14, 'normal', 40.1512, 65.3810, '2026-07-13', true),
  school(7, 'Ismoilov Bekzod', '+998 93 511 07 07', 46, 720, 18, 1040, 5, 'normal', 40.1495, 65.3910, '2026-07-13', true),
  school(8, 'Abdullayeva Madina', '+998 93 511 08 08', 29, 410, 15, 640, 55, 'problem', 40.1720, 65.3555, '2026-07-05', false),
  school(9, 'Xolmatov Rustam', '+998 93 511 09 09', 43, 700, 18, 1010, 11, 'normal', 40.1640, 65.3890, '2026-07-12', true),
  school(10, 'Sodiqov Farhod', '+998 93 511 10 10', 48, 790, 19, 1120, 15, 'normal', 40.1610, 65.3980, '2026-07-12', true),
  school(11, 'Tursunova Zilola', '+998 93 511 11 11', 35, 550, 16, 820, 30, 'shortage', 40.1470, 65.3655, '2026-07-10', true),
  school(12, 'Yusupova Nilufar', '+998 93 511 12 12', 36, 560, 17, 860, 32, 'shortage', 40.1450, 65.3700, '2026-07-11', true),
  school(13, 'Rahmonov Bobur', '+998 93 511 13 13', 45, 740, 18, 1060, 9, 'normal', 40.1560, 65.3730, '2026-07-13', true),
  school(14, 'Ganiev Sardor', '+998 93 511 14 14', 55, 920, 20, 1280, 0, 'overload', 40.1530, 65.3600, '2026-07-13', true),
  school(15, 'Kholiqova Zarina', '+998 93 511 15 15', 40, 650, 18, 940, 18, 'normal', 40.1755, 65.3822, '2026-07-09', true),
  school(16, 'Juraev Shuhrat', '+998 93 511 16 16', 33, 520, 16, 760, 36, 'shortage', 40.1690, 65.3680, '2026-07-08', true),
  school(17, 'Norboyeva Kamola', '+998 93 511 17 17', 49, 810, 19, 1150, 7, 'overload', 40.1425, 65.3940, '2026-07-12', true),
  school(18, 'Mirzayev Umid', '+998 93 511 18 18', 44, 700, 18, 1000, 10, 'normal', 40.1402, 65.3888, '2026-07-13', true),
  school(19, 'Saidov Ilhom', '+998 93 511 19 19', 38, 600, 17, 900, 20, 'normal', 40.1730, 65.3770, '2026-07-11', true),
  school(20, 'Olimova Shahzoda', '+998 93 511 20 20', 32, 480, 16, 720, 48, 'problem', 40.1666, 65.3450, '2026-07-03', false),
  school(21, 'Mamatov Doniyor', '+998 93 511 21 21', 42, 690, 18, 990, 13, 'normal', 40.1540, 65.4005, '2026-07-13', true),
  school(22, 'Ergashev Dilshod', '+998 93 511 22 22', 47, 760, 19, 1080, 6, 'normal', 40.1577, 65.4025, '2026-07-12', true),
  school(23, 'Alimova Sevinch', '+998 93 511 23 23', 36, 570, 17, 850, 26, 'shortage', 40.1460, 65.3580, '2026-07-09', true),
  school(24, 'Usmonov Azizbek', '+998 93 511 24 24', 50, 830, 19, 1170, 3, 'overload', 40.1710, 65.3860, '2026-07-13', true),
  school(25, 'Xasanova Gulchehra', '+998 93 511 25 25', 39, 610, 17, 890, 22, 'shortage', 40.1488, 65.3544, '2026-07-13', true),
  school(26, 'Karimova Nodira', '+998 93 511 26 26', 41, 660, 18, 950, 16, 'normal', 40.1635, 65.3510, '2026-07-10', true),
  school(27, 'Sultonov Jahongir', '+998 93 511 27 27', 34, 530, 16, 790, 34, 'shortage', 40.1500, 65.3965, '2026-07-07', true),
  school(28, 'Boymurodov Aziz', '+998 93 511 28 28', 53, 880, 20, 1220, 4, 'overload', 40.1701, 65.3922, '2026-07-11', true),
]

const handcraftedTeachers: Teacher[] = [
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
  ...handcraftedTeachers,
  ...teacherSeeds.map((seed, index) => ({
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
  })),
]

export const subjects: SubjectStat[] = [
  { id: 's1', name: 'Matematika', teachersCount: 48, totalHours: 1420, vacantHours: 36, overloadHours: 48, topSchool: '14-maktab' },
  { id: 's2', name: 'Ona tili', teachersCount: 52, totalHours: 1580, vacantHours: 12, overloadHours: 64, topSchool: '3-maktab' },
  { id: 's3', name: 'Ingliz tili', teachersCount: 34, totalHours: 980, vacantHours: 72, overloadHours: 20, topSchool: '28-maktab' },
  { id: 's4', name: 'Fizika', teachersCount: 28, totalHours: 760, vacantHours: 44, overloadHours: 16, topSchool: '1-maktab' },
  { id: 's5', name: 'Biologiya', teachersCount: 30, totalHours: 820, vacantHours: 28, overloadHours: 12, topSchool: '10-maktab' },
  { id: 's6', name: 'Informatika', teachersCount: 22, totalHours: 640, vacantHours: 58, overloadHours: 8, topSchool: '22-maktab' },
  { id: 's7', name: 'Tarix', teachersCount: 26, totalHours: 700, vacantHours: 18, overloadHours: 10, topSchool: '18-maktab' },
  { id: 's8', name: 'Kimyo', teachersCount: 24, totalHours: 680, vacantHours: 40, overloadHours: 14, topSchool: '7-maktab' },
]

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
  const withData = schools.filter((s) => s.hasData)
  const today = '2026-07-13'
  return {
    totalSchools: schools.length,
    totalTeachers: schools.reduce((a, s) => a + s.teachersCount, 0),
    totalStudents: schools.reduce((a, s) => a + s.studentsCount, 0),
    totalWeeklyHours: schools.reduce((a, s) => a + s.weeklyHours, 0),
    vacantHours: schools.reduce((a, s) => a + s.vacantHours, 0),
    mostLoadedSubject: 'Ona tili',
    leastLoadedSubject: 'Informatika',
    updatedToday: withData.filter((s) => s.updatedAt === today).length,
    noDataSchools: schools.filter((s) => !s.hasData).length,
  }
}

export function getCharts(): ChartBundle {
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
    subjectBars: subjects.slice(0, 6).map((s) => ({ subject: s.name, hours: s.totalHours })),
    radarMetrics: [
      { metric: 'Yuklama', value: 78 },
      { metric: 'Kadr', value: 64 },
      { metric: 'Maʼlumot', value: 86 },
      { metric: 'Vakansiya', value: 42 },
      { metric: 'Sifat', value: 71 },
      { metric: 'Yangilanish', value: 69 },
    ],
    treemap: schools.map((s) => ({ name: s.name, value: s.weeklyHours })),
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
  return schools
}

export async function fetchSchool(id: string) {
  await delay(250)
  return schools.find((s) => s.id === id) ?? null
}

export async function fetchTeachers() {
  await delay(350)
  return teachers
}

export async function fetchTeacher(id: string) {
  await delay(250)
  return teachers.find((t) => t.id === id) ?? null
}

export async function fetchSubjects() {
  await delay(300)
  return [...subjects]
}

export async function createSubject(name: string) {
  await delay(250)
  const created: SubjectStat = {
    id: `s${Date.now()}`,
    name: name.trim(),
    teachersCount: 0,
    totalHours: 0,
    vacantHours: 0,
    overloadHours: 0,
    topSchool: '—',
  }
  subjects.push(created)
  return created
}

export async function fetchDashboard() {
  await delay(400)
  return {
    kpis: getDashboardKpis(),
    charts: getCharts(),
    insights: aiInsights,
    schools,
    notifications,
  }
}

export async function globalSearch(query: string) {
  await delay(200)
  const q = query.trim().toLowerCase()
  if (!q) return { schools: [], teachers: [], subjects: [] }
  return {
    schools: schools.filter(
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
    subjects: subjects.filter((s) => s.name.toLowerCase().includes(q)),
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
