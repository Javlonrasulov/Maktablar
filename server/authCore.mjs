export const DEFAULT_ADMIN = {
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

export function normalizeLogin(login) {
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
    jobRole: user.jobRole,
    permissions: Array.isArray(user.permissions) ? [...user.permissions] : [],
  }
}

function httpError(message, status) {
  const err = new Error(message)
  err.status = status
  throw err
}

function ensureAdminPresent(users) {
  if (!Array.isArray(users) || users.length === 0) return [DEFAULT_ADMIN]
  if (!users.some((u) => u.id === 'user-admin')) return [DEFAULT_ADMIN, ...users]
  return users
}

/**
 * @param {{ readUsers: () => Promise<any[]>, writeUsers: (users: any[]) => Promise<void> }} storage
 */
export function createAuthHandlers(storage) {
  async function loadUsers() {
    const raw = await storage.readUsers()
    const normalized = ensureAdminPresent(raw)
    if (JSON.stringify(raw) !== JSON.stringify(normalized)) {
      await storage.writeUsers(normalized)
    }
    return normalized
  }

  return {
    async listSystemUsers() {
      const users = await loadUsers()
      return users.map(toPublic)
    },

    async createSystemUser(input) {
      const users = await loadUsers()
      const login = String(input.login ?? '').trim()
      const password = String(input.password ?? '').trim()
      if (!login || !password) httpError('INVALID_INPUT', 400)
      if (users.some((u) => normalizeLogin(u.login) === normalizeLogin(login))) {
        httpError('LOGIN_EXISTS', 409)
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
      await storage.writeUsers([created, ...users])
      return toPublic(created)
    },

    async updateSystemUser(id, input) {
      const users = await loadUsers()
      const idx = users.findIndex((u) => u.id === id)
      if (idx < 0) httpError('NOT_FOUND', 404)
      const current = users[idx]
      const nextLogin = String(input.login ?? '').trim()
      if (!nextLogin) httpError('INVALID_LOGIN', 400)
      if (users.some((u) => u.id !== id && normalizeLogin(u.login) === normalizeLogin(nextLogin))) {
        httpError('LOGIN_EXISTS', 409)
      }
      const passwordRaw = input.password != null ? String(input.password).trim() : ''
      if (passwordRaw && passwordRaw.length < 4) httpError('WEAK_PASSWORD', 400)
      const updated = {
        ...current,
        login: nextLogin,
        password: passwordRaw || current.password,
        displayName: String(input.fullName ?? '').trim() || current.displayName,
        jobRole: String(input.jobRole ?? '').trim() || current.jobRole || 'operator',
        permissions: Array.isArray(input.permissions)
          ? [...input.permissions]
          : current.permissions,
      }
      users[idx] = updated
      await storage.writeUsers(users)
      return toPublic(updated)
    },

    async deleteSystemUser(id) {
      if (id === 'user-admin') httpError('PROTECTED', 403)
      const users = await loadUsers()
      if (!users.some((u) => u.id === id)) httpError('NOT_FOUND', 404)
      await storage.writeUsers(users.filter((u) => u.id !== id))
    },

    async loginWithCredentials(body) {
      const normalizedLogin = normalizeLogin(body.login)
      const password = String(body.password ?? '').trim()
      const serverUsers = await loadUsers()
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
          jobRole: foundLocal.jobRole,
          permissions: Array.isArray(foundLocal.permissions) ? [...foundLocal.permissions] : undefined,
        }
      }

      httpError('INVALID_CREDENTIALS', 401)
    },
  }
}
