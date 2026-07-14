import type {
  AuthUser,
  CreateSchoolInput,
  School,
  SchoolProfileInput,
  SubjectStat,
  Teacher,
  TeacherAssignment,
} from './types'

const SCHOOLS_KEY = 'navbahor-schools'
const TEACHERS_KEY = 'navbahor-teachers'
const SESSION_KEY = 'navbahor-session'
const USERS_KEY = 'navbahor-users'
const SYSTEM_USERS_KEY = 'navbahor-system-users'
const SUBJECTS_KEY = 'navbahor-subjects'

interface StoredUser {
  id: string
  login: string
  password: string
  role: AuthUser['role']
  displayName: string
  schoolId?: string
  /** Lavozim (Admin, Direktor, Operator, ...) — login roli emas */
  jobRole?: string
  permissions?: string[]
}

export type SystemUserRecord = {
  id: string
  fullName: string
  login: string
  jobRole: string
  permissions: string[]
}

export type CreateSystemUserInput = {
  fullName: string
  login: string
  password: string
  jobRole: string
  permissions: string[]
}

export type UpdateSystemUserInput = {
  fullName: string
  login: string
  password?: string
  jobRole: string
  permissions: string[]
}

function normalizeLogin(login: string) {
  return login.trim().toLowerCase().replace(/[\s()-]/g, '')
}

function getUsers(): StoredUser[] {
  ensureSeed()
  return readJson<StoredUser[]>(USERS_KEY, buildUsersFromSchools(getSchoolsSync()))
}

function saveUsers(users: StoredUser[]) {
  writeJson(USERS_KEY, users)
}

function getSystemUsersStore(): StoredUser[] {
  ensureSeed()
  return readJson<StoredUser[]>(SYSTEM_USERS_KEY, [])
}

function saveSystemUsersStore(users: StoredUser[]) {
  writeJson(SYSTEM_USERS_KEY, users)
}

function allLoginAccounts(): StoredUser[] {
  return [...getSystemUsersStore(), ...getUsers()]
}

function toSystemUserRecord(user: StoredUser): SystemUserRecord {
  return {
    id: user.id,
    fullName: user.displayName,
    login: user.login,
    jobRole: user.jobRole ?? 'admin',
    permissions: user.permissions ?? [],
  }
}

function isBuiltinAdmin(user: StoredUser) {
  return user.id === 'user-admin'
}

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
    address: 'Navbahor tumani',
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
    login: `maktab${number}`,
    password: `maktab${number}`,
    subjectsList: hasData ? 'Matematika, Ona tili, Ingliz tili, Fizika' : '',
    classesList: hasData
      ? JSON.stringify(['1-A', '2-A', '3-A', '4-A', '5-A', '6-A', '7-A', '8-A', '9-A', '10-A', '11-A'])
      : '',
    vacancies: hasData ? '' : '',
    schedule: '',
    workloadsNote: '',
    profileComplete: hasData,
  }
}

const seedSchools: School[] = [
  school(1, 'Karimov Abduvali', '+998 93 511 01 01', 42, 680, 18, 980, 12, 'normal', 40.1582, 65.3781, '2026-07-13', true),
  school(2, 'Rakhimova Dilnoza', '+998 93 511 02 02', 38, 620, 17, 910, 28, 'shortage', 40.1621, 65.3712, '2026-07-12', true),
  school(3, 'Toshpulatov Jasur', '+998 93 511 03 03', 51, 840, 19, 1180, 8, 'overload', 40.1554, 65.3855, '2026-07-13', true),
  school(4, 'Axmedova Dilbar', '+998 93 511 04 04', 37, 590, 17, 870, 24, 'shortage', 40.1605, 65.3750, '2026-07-11', true),
  school(5, 'Nurmatova Sevara', '+998 93 511 05 05', 34, 540, 16, 780, 40, 'shortage', 40.1688, 65.3620, '2026-07-10', true),
  school(6, 'Qodirov Anvar', '+998 93 511 06 06', 41, 670, 18, 960, 14, 'normal', 40.1512, 65.3810, '2026-07-13', true),
  school(7, 'Ismoilov Bekzod', '+998 93 511 07 07', 46, 720, 18, 1040, 5, 'normal', 40.1495, 65.3910, '2026-07-13', true),
  school(8, 'Abdullayeva Madina', '+998 93 511 08 08', 29, 410, 15, 640, 55, 'normal', 40.1720, 65.3555, '2026-07-05', false),
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
  school(20, 'Olimova Shahzoda', '+998 93 511 20 20', 32, 480, 16, 720, 48, 'normal', 40.1666, 65.3450, '2026-07-03', false),
  school(21, 'Mamatov Doniyor', '+998 93 511 21 21', 42, 690, 18, 990, 13, 'normal', 40.1540, 65.4005, '2026-07-13', true),
  school(22, 'Ergashev Dilshod', '+998 93 511 22 22', 47, 760, 19, 1080, 6, 'normal', 40.1577, 65.4025, '2026-07-12', true),
  school(23, 'Alimova Sevinch', '+998 93 511 23 23', 36, 570, 17, 850, 26, 'shortage', 40.1460, 65.3580, '2026-07-09', true),
  school(24, 'Usmonov Azizbek', '+998 93 511 24 24', 50, 830, 19, 1170, 3, 'overload', 40.1710, 65.3860, '2026-07-13', true),
  school(25, 'Xasanova Gulchehra', '+998 93 511 25 25', 39, 610, 17, 890, 22, 'shortage', 40.1488, 65.3544, '2026-07-13', true),
  school(26, 'Karimova Nodira', '+998 93 511 26 26', 41, 660, 18, 950, 16, 'normal', 40.1635, 65.3510, '2026-07-10', true),
  school(27, 'Sultonov Jahongir', '+998 93 511 27 27', 34, 530, 16, 790, 34, 'shortage', 40.1500, 65.3965, '2026-07-07', true),
  school(28, 'Boymurodov Aziz', '+998 93 511 28 28', 53, 880, 20, 1220, 4, 'overload', 40.1701, 65.3922, '2026-07-11', true),
]

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value))
}

function buildUsersFromSchools(list: School[]): StoredUser[] {
  const schoolUsers: StoredUser[] = list.map((s) => ({
    id: `user-${s.id}`,
    login: s.login,
    password: s.password,
    role: 'school',
    displayName: s.name,
    schoolId: s.id,
  }))
  return [
    {
      id: 'user-admin',
      login: 'admin',
      password: 'admin123',
      role: 'admin',
      displayName: 'Tuman admin',
      jobRole: 'admin',
      permissions: [
        'dashboard',
        'schools',
        'teachers',
        'subjects',
        'workload',
        'map',
        'systemUsers',
      ],
    },
    ...schoolUsers,
  ]
}

const seedSubjects: SubjectStat[] = [
  { id: 's1', name: 'Matematika', teachersCount: 48, totalHours: 1420, vacantHours: 36, overloadHours: 48, topSchool: '14-maktab' },
  { id: 's2', name: 'Ona tili', teachersCount: 52, totalHours: 1580, vacantHours: 12, overloadHours: 64, topSchool: '3-maktab' },
  { id: 's3', name: 'Ingliz tili', teachersCount: 34, totalHours: 980, vacantHours: 72, overloadHours: 20, topSchool: '28-maktab' },
  { id: 's4', name: 'Fizika', teachersCount: 28, totalHours: 760, vacantHours: 44, overloadHours: 16, topSchool: '1-maktab' },
  { id: 's5', name: 'Biologiya', teachersCount: 30, totalHours: 820, vacantHours: 28, overloadHours: 12, topSchool: '10-maktab' },
  { id: 's6', name: 'Informatika', teachersCount: 22, totalHours: 640, vacantHours: 58, overloadHours: 8, topSchool: '22-maktab' },
  { id: 's7', name: 'Tarix', teachersCount: 26, totalHours: 700, vacantHours: 18, overloadHours: 10, topSchool: '18-maktab' },
  { id: 's8', name: 'Kimyo', teachersCount: 24, totalHours: 680, vacantHours: 40, overloadHours: 14, topSchool: '7-maktab' },
]

function ensureSeed() {
  if (!localStorage.getItem(SCHOOLS_KEY)) {
    writeJson(SCHOOLS_KEY, seedSchools)
  }
  if (!localStorage.getItem(USERS_KEY)) {
    const schools = readJson<School[]>(SCHOOLS_KEY, seedSchools)
    writeJson(USERS_KEY, buildUsersFromSchools(schools))
  }
  // Eski versiyada tizim foydalanuvchilari USERS_KEY ichida edi — ajratib olamiz
  if (!localStorage.getItem(SYSTEM_USERS_KEY)) {
    const users = readJson<StoredUser[]>(USERS_KEY, [])
    const migrated = users.filter(
      (u) => u.role === 'admin' && !u.schoolId && u.id !== 'user-admin',
    )
    writeJson(SYSTEM_USERS_KEY, migrated)
    if (migrated.length) {
      writeJson(
        USERS_KEY,
        users.filter((u) => !migrated.some((m) => m.id === u.id)),
      )
    }
  }
  if (!localStorage.getItem(SUBJECTS_KEY)) {
    writeJson(SUBJECTS_KEY, seedSubjects)
  }
  // Eski default: to'liq bo'lmagan maktablar 'problem' edi — 'normal'ga o'tkazamiz
  const schools = readJson<School[]>(SCHOOLS_KEY, [])
  let schoolsChanged = false
  const fixedSchools = schools.map((school) => {
    if (school.status === 'problem' && !school.profileComplete) {
      schoolsChanged = true
      return { ...school, status: 'normal' as const }
    }
    return school
  })
  if (schoolsChanged) {
    writeJson(SCHOOLS_KEY, fixedSchools)
  }
}

export function getSubjectsSync(): SubjectStat[] {
  ensureSeed()
  return readJson<SubjectStat[]>(SUBJECTS_KEY, seedSubjects)
}

export function createSubjectSync(name: string): SubjectStat {
  const list = getSubjectsSync()
  const trimmed = name.trim()
  const existing = list.find((s) => s.name.toLowerCase() === trimmed.toLowerCase())
  if (existing) return existing
  const created: SubjectStat = {
    id: `s${Date.now()}`,
    name: trimmed,
    teachersCount: 0,
    totalHours: 0,
    vacantHours: 0,
    overloadHours: 0,
    topSchool: '—',
  }
  writeJson(SUBJECTS_KEY, [...list, created])
  return created
}

export function parseSubjectsList(value: string): string[] {
  return value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
}

export function joinSubjectsList(names: string[]): string {
  return names.join(', ')
}

export function parseClassesList(value: string): string[] {
  const text = value.trim()
  if (!text) return []
  try {
    const parsed = JSON.parse(text) as unknown
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => (typeof item === 'string' ? item.trim() : ''))
        .filter(Boolean)
    }
  } catch {
    // legacy comma-separated
  }
  return text
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
}

export function serializeClassesList(names: string[]): string {
  if (names.length === 0) return ''
  return JSON.stringify(names)
}

export function deriveTeacherFromAssignments(assignments: TeacherAssignment[]) {
  return {
    subjects: [...new Set(assignments.map((a) => a.subject))],
    classes: [...new Set(assignments.map((a) => a.className))],
    weeklyHours: assignments.reduce((sum, a) => sum + (a.hours || 0), 0),
  }
}

export function formatAssignmentLine(
  item: TeacherAssignment,
  hoursWord: string,
): string {
  return `${item.className} — ${item.subject} — ${item.hours} ${hoursWord}`
}

export const VACANCY_OTHER = '__other__'

export type VacancyItem = {
  id: string
  subject: string
  note: string
  hours: number
}

export function parseVacancies(raw: string): VacancyItem[] {
  const text = raw.trim()
  if (!text) return []
  try {
    const parsed = JSON.parse(text) as unknown
    if (!Array.isArray(parsed)) return legacyVacancy(text)
    return parsed
      .map((item, index) => {
        if (!item || typeof item !== 'object') return null
        const row = item as Record<string, unknown>
        const subject = typeof row.subject === 'string' ? row.subject.trim() : ''
        const note = typeof row.note === 'string' ? row.note.trim() : ''
        const hours = Number(row.hours)
        if (!subject && !note) return null
        return {
          id: typeof row.id === 'string' ? row.id : `vac-${index}-${Date.now()}`,
          subject: subject || VACANCY_OTHER,
          note,
          hours: Number.isFinite(hours) && hours >= 0 ? hours : 0,
        } satisfies VacancyItem
      })
      .filter((item): item is VacancyItem => Boolean(item))
  } catch {
    return legacyVacancy(text)
  }
}

function legacyVacancy(text: string): VacancyItem[] {
  return [
    {
      id: `vac-legacy-${Date.now()}`,
      subject: VACANCY_OTHER,
      note: text,
      hours: 0,
    },
  ]
}

export function serializeVacancies(items: VacancyItem[]): string {
  if (items.length === 0) return ''
  return JSON.stringify(items)
}

export function vacancyHoursTotal(items: VacancyItem[]): number {
  return items.reduce((sum, item) => sum + (item.hours || 0), 0)
}

export function formatVacancyLabel(item: VacancyItem, otherLabel: string): string {
  if (item.subject === VACANCY_OTHER) {
    return item.note.trim() || otherLabel
  }
  return item.subject
}

export function getSchoolsSync(): School[] {
  ensureSeed()
  return readJson<School[]>(SCHOOLS_KEY, seedSchools)
}

export function getSchoolSync(id: string): School | null {
  return getSchoolsSync().find((s) => s.id === id) ?? null
}

export function saveSchools(list: School[]) {
  writeJson(SCHOOLS_KEY, list)
  const users = getUsers()
  const admin = users.find((u) => u.id === 'user-admin') ?? {
    id: 'user-admin',
    login: 'admin',
    password: 'admin123',
    role: 'admin' as const,
    displayName: 'Tuman admin',
    jobRole: 'admin',
    permissions: [
      'dashboard',
      'schools',
      'teachers',
      'subjects',
      'workload',
      'map',
      'systemUsers',
    ],
  }
  const schoolUsers = buildUsersFromSchools(list).filter((u) => u.role === 'school')
  // Tizim foydalanuvchilari alohida kalitda — bu yerda tegilmaydi
  saveUsers([admin, ...schoolUsers])
}

function isProfileComplete(school: School): boolean {
  return Boolean(
    school.director.trim() &&
      school.phone.trim() &&
      school.address.trim() &&
      school.teachersCount > 0 &&
      school.studentsCount > 0 &&
      school.subjectsCount > 0 &&
      school.subjectsList.trim() &&
      school.classesList.trim() &&
      school.lat !== 0 &&
      school.lng !== 0,
  )
}

export function createSchoolAccount(input: CreateSchoolInput): School {
  const list = getSchoolsSync()
  const login = normalizeLogin(input.login)
  if (allLoginAccounts().some((u) => normalizeLogin(u.login) === login)) {
    throw new Error('LOGIN_EXISTS')
  }
  const maxNumber = list.reduce((max, s) => Math.max(max, s.number), 0)
  const number = maxNumber + 1
  const now = new Date().toISOString().slice(0, 10)
  const created: School = {
    id: `school-${number}-${Date.now()}`,
    number,
    name: input.name.trim(),
    director: '',
    phone: '',
    address: '',
    teachersCount: 0,
    studentsCount: 0,
    subjectsCount: 0,
    weeklyHours: 0,
    vacantHours: 0,
    status: 'normal',
    lat: 40.158,
    lng: 65.375,
    updatedAt: now,
    hasData: false,
    login,
    password: input.password,
    subjectsList: '',
    classesList: '',
    vacancies: '',
    schedule: '',
    workloadsNote: '',
    profileComplete: false,
  }
  saveSchools([created, ...list])
  return created
}

export function updateSchoolProfile(id: string, patch: SchoolProfileInput): School {
  const list = getSchoolsSync()
  const idx = list.findIndex((s) => s.id === id)
  if (idx < 0) throw new Error('NOT_FOUND')
  const current = list[idx]
  const next: School = {
    ...current,
    ...patch,
    name: patch.name?.trim() || current.name,
    updatedAt: new Date().toISOString().slice(0, 10),
  }
  next.profileComplete = isProfileComplete(next)
  next.hasData = next.profileComplete
  if (next.profileComplete && !current.hasData) {
    next.status = next.status === 'problem' ? 'normal' : next.status
  }
  const copy = [...list]
  copy[idx] = next
  saveSchools(copy)
  return next
}

function getLocalAccountsSnapshot(): StoredUser[] {
  return allLoginAccounts().map((u) => ({
    id: u.id,
    login: u.login,
    password: u.password,
    role: u.role,
    displayName: u.displayName,
    schoolId: u.schoolId,
    jobRole: u.jobRole,
    permissions: u.permissions,
  }))
}

export async function loginWithCredentials(login: string, password: string): Promise<AuthUser> {
  const normalizedLogin = normalizeLogin(login)
  const normalizedPassword = password.trim()
  const localAccounts = getLocalAccountsSnapshot()

  try {
    const { apiLogin } = await import('./authApi')
    const user = await apiLogin(
      login,
      password,
      localAccounts.map((u) => ({
        id: u.id,
        login: u.login,
        password: u.password,
        role: u.role,
        displayName: u.displayName,
        schoolId: u.schoolId,
      })),
    )
    writeJson(SESSION_KEY, user)
    return user
  } catch (err) {
    // Server ishlamasa — faqat shu qurilmadagi hisoblar
    if (err instanceof Error && err.message === 'INVALID_CREDENTIALS') {
      throw err
    }
  }

  const found = localAccounts.find(
    (u) => normalizeLogin(u.login) === normalizedLogin && u.password === normalizedPassword,
  )
  if (!found) throw new Error('INVALID_CREDENTIALS')
  const user: AuthUser = {
    id: found.id,
    login: found.login,
    role: found.role,
    displayName: found.displayName,
    schoolId: found.schoolId,
  }
  writeJson(SESSION_KEY, user)
  return user
}

export async function listSystemUsers(): Promise<SystemUserRecord[]> {
  const { apiListSystemUsers } = await import('./authApi')
  return await apiListSystemUsers()
}

export async function createSystemUser(input: CreateSystemUserInput): Promise<SystemUserRecord> {
  const { apiCreateSystemUser } = await import('./authApi')
  return await apiCreateSystemUser(input)
}

export async function updateSystemUser(
  id: string,
  input: UpdateSystemUserInput,
): Promise<SystemUserRecord> {
  const { apiUpdateSystemUser } = await import('./authApi')
  const updated = await apiUpdateSystemUser(id, input)
  const session = getSession()
  if (session?.id === id) {
    writeJson(SESSION_KEY, {
      ...session,
      login: updated.login,
      displayName: updated.fullName,
    })
  }
  return updated
}

export async function deleteSystemUser(id: string): Promise<void> {
  const { apiDeleteSystemUser } = await import('./authApi')
  await apiDeleteSystemUser(id)
}

export function getSession(): AuthUser | null {
  return readJson<AuthUser | null>(SESSION_KEY, null)
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

export function updateAccountCredentials(
  userId: string,
  input: { login: string; currentPassword: string; newPassword?: string },
): AuthUser {
  const users = getUsers()
  const idx = users.findIndex((u) => u.id === userId)
  if (idx < 0) throw new Error('NOT_FOUND')

  const current = users[idx]!
  if (current.password !== input.currentPassword) {
    throw new Error('INVALID_PASSWORD')
  }

  const nextLogin = input.login.trim()
  if (!nextLogin) throw new Error('INVALID_LOGIN')

  const loginTaken = allLoginAccounts().some(
    (u) => u.id !== userId && normalizeLogin(u.login) === normalizeLogin(nextLogin),
  )
  if (loginTaken) throw new Error('LOGIN_EXISTS')

  const nextPassword = input.newPassword?.trim()
    ? input.newPassword.trim()
    : current.password

  if (input.newPassword !== undefined && input.newPassword.trim() && input.newPassword.trim().length < 4) {
    throw new Error('WEAK_PASSWORD')
  }

  const updated: StoredUser = {
    ...current,
    login: nextLogin,
    password: nextPassword,
  }
  const copy = [...users]
  copy[idx] = updated
  saveUsers(copy)

  if (updated.role === 'school' && updated.schoolId) {
    const schools = getSchoolsSync()
    const schoolIdx = schools.findIndex((s) => s.id === updated.schoolId)
    if (schoolIdx >= 0) {
      const nextSchools = [...schools]
      nextSchools[schoolIdx] = {
        ...nextSchools[schoolIdx]!,
        login: nextLogin,
        password: nextPassword,
      }
      writeJson(SCHOOLS_KEY, nextSchools)
    }
  }

  const session: AuthUser = {
    id: updated.id,
    login: updated.login,
    role: updated.role,
    displayName: updated.displayName,
    schoolId: updated.schoolId,
  }
  writeJson(SESSION_KEY, session)
  return session
}

export function getTeachersForSchool(schoolId: string): Teacher[] {
  return getAllTeachersSync().filter((t) => t.schoolId === schoolId)
}

export function getAllTeachersSync(): Teacher[] {
  ensureSeed()
  return readJson<Teacher[]>(TEACHERS_KEY, []).map(normalizeTeacher)
}

function normalizeTeacher(teacher: Teacher): Teacher {
  const assignments = Array.isArray(teacher.assignments) ? teacher.assignments : []
  if (assignments.length > 0) {
    return { ...teacher, assignments, ...deriveTeacherFromAssignments(assignments) }
  }
  return {
    ...teacher,
    assignments: [],
    subjects: teacher.subjects ?? [],
    classes: teacher.classes ?? [],
    weeklyHours: teacher.weeklyHours ?? 0,
  }
}

export function saveTeacherForSchool(teacher: Omit<Teacher, 'id'> & { id?: string }): Teacher {
  const all = readJson<Teacher[]>(TEACHERS_KEY, [])
  const id = teacher.id ?? `t-${Date.now()}`
  const assignments = teacher.assignments ?? []
  const derived = deriveTeacherFromAssignments(assignments)
  const next: Teacher = normalizeTeacher({ ...teacher, ...derived, assignments, id })
  const idx = all.findIndex((t) => t.id === id)
  if (idx >= 0) all[idx] = next
  else all.unshift(next)
  writeJson(TEACHERS_KEY, all)
  return next
}

export function removeTeacher(id: string) {
  const all = readJson<Teacher[]>(TEACHERS_KEY, [])
  writeJson(
    TEACHERS_KEY,
    all.filter((t) => t.id !== id),
  )
}

export { seedSchools }
