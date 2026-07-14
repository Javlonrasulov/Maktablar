import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, 'data')
const USERS_FILE = path.join(DATA_DIR, 'system-users.json')

const DEFAULT_ADMIN = {
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
    'reports',
    'systemUsers',
  ],
}

function ensureData() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([DEFAULT_ADMIN], null, 2), 'utf8')
  }
}

function readUsers() {
  ensureData()
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf8')
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length === 0) {
      writeUsers([DEFAULT_ADMIN])
      return [DEFAULT_ADMIN]
    }
    if (!parsed.some((u) => u.id === 'user-admin')) {
      const next = [DEFAULT_ADMIN, ...parsed]
      writeUsers(next)
      return next
    }
    return parsed
  } catch {
    writeUsers([DEFAULT_ADMIN])
    return [DEFAULT_ADMIN]
  }
}

function writeUsers(users) {
  ensureData()
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8')
}

function normalizeLogin(login) {
  return String(login ?? '')
    .trim()
    .toLowerCase()
    .replace(/[\s()-]/g, '')
}

function toPublic(user) {
  return {
    id: user.id,
    fullName: user.displayName,
    login: user.login,
    jobRole: user.jobRole ?? 'admin',
    permissions: user.permissions ?? [],
  }
}

function toAuth(user) {
  return {
    id: user.id,
    login: user.login,
    role: user.role ?? 'admin',
    displayName: user.displayName,
    schoolId: user.schoolId,
  }
}

export function listSystemUsers() {
  return readUsers().map(toPublic)
}

export function createSystemUser(input) {
  const users = readUsers()
  const login = String(input.login ?? '').trim()
  const password = String(input.password ?? '').trim()
  if (!login || !password) {
    const err = new Error('INVALID_INPUT')
    err.status = 400
    throw err
  }
  if (users.some((u) => normalizeLogin(u.login) === normalizeLogin(login))) {
    const err = new Error('LOGIN_EXISTS')
    err.status = 409
    throw err
  }
  const created = {
    id: `user-sys-${Date.now()}`,
    login,
    password,
    role: 'admin',
    displayName: String(input.fullName ?? '').trim() || login,
    jobRole: String(input.jobRole ?? '').trim() || 'operator',
    permissions: Array.isArray(input.permissions) ? [...input.permissions] : [],
  }
  writeUsers([created, ...users])
  return toPublic(created)
}

export function updateSystemUser(id, input) {
  const users = readUsers()
  const idx = users.findIndex((u) => u.id === id)
  if (idx < 0) {
    const err = new Error('NOT_FOUND')
    err.status = 404
    throw err
  }
  const current = users[idx]
  const nextLogin = String(input.login ?? '').trim()
  if (!nextLogin) {
    const err = new Error('INVALID_LOGIN')
    err.status = 400
    throw err
  }
  if (users.some((u) => u.id !== id && normalizeLogin(u.login) === normalizeLogin(nextLogin))) {
    const err = new Error('LOGIN_EXISTS')
    err.status = 409
    throw err
  }
  const passwordRaw = input.password != null ? String(input.password).trim() : ''
  if (passwordRaw && passwordRaw.length < 4) {
    const err = new Error('WEAK_PASSWORD')
    err.status = 400
    throw err
  }
  const updated = {
    ...current,
    login: nextLogin,
    password: passwordRaw || current.password,
    displayName: String(input.fullName ?? '').trim() || current.displayName,
    jobRole: String(input.jobRole ?? '').trim() || current.jobRole || 'operator',
    permissions: Array.isArray(input.permissions) ? [...input.permissions] : current.permissions,
  }
  users[idx] = updated
  writeUsers(users)
  return toPublic(updated)
}

export function deleteSystemUser(id) {
  if (id === 'user-admin') {
    const err = new Error('PROTECTED')
    err.status = 403
    throw err
  }
  const users = readUsers()
  if (!users.some((u) => u.id === id)) {
    const err = new Error('NOT_FOUND')
    err.status = 404
    throw err
  }
  writeUsers(users.filter((u) => u.id !== id))
}

/**
 * @param {{ login: string, password: string, localAccounts?: Array<{id:string,login:string,password:string,role:string,displayName:string,schoolId?:string}> }} body
 */
export function loginWithCredentials(body) {
  const normalizedLogin = normalizeLogin(body.login)
  const password = String(body.password ?? '').trim()
  const serverUsers = readUsers()
  const foundServer = serverUsers.find(
    (u) => normalizeLogin(u.login) === normalizedLogin && u.password === password,
  )
  if (foundServer) return toAuth(foundServer)

  const locals = Array.isArray(body.localAccounts) ? body.localAccounts : []
  const foundLocal = locals.find(
    (u) => normalizeLogin(u.login) === normalizedLogin && String(u.password) === password,
  )
  if (foundLocal) {
    return {
      id: foundLocal.id,
      login: foundLocal.login,
      role: foundLocal.role,
      displayName: foundLocal.displayName,
      schoolId: foundLocal.schoolId,
    }
  }

  const err = new Error('INVALID_CREDENTIALS')
  err.status = 401
  throw err
}
