import { getStore } from '@netlify/blobs'
import { createAuthHandlers, DEFAULT_ADMIN } from '../../server/authCore.mjs'

const USERS_KEY = 'system-users'

function json(status, data) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}

function createBlobHandlers() {
  const store = getStore({ name: 'navbahor-auth', consistency: 'strong' })
  return createAuthHandlers({
    async readUsers() {
      const data = await store.get(USERS_KEY, { type: 'json' })
      return Array.isArray(data) ? data : [DEFAULT_ADMIN]
    },
    async writeUsers(users) {
      await store.setJSON(USERS_KEY, users)
    },
  })
}

async function readJson(req) {
  try {
    return await req.json()
  } catch {
    return {}
  }
}

function parseRoute(pathname) {
  const path = pathname.replace(/\/$/, '') || '/'
  const userMatch = path.match(/system-users\/([^/]+)$/)
  if (userMatch) return { kind: 'user', id: decodeURIComponent(userMatch[1]) }
  if (path.includes('system-users')) return { kind: 'users' }
  if (path.includes('login')) return { kind: 'login' }
  return { kind: 'unknown' }
}

export default async (req) => {
  const url = new URL(req.url)
  const route = parseRoute(url.pathname)
  const auth = createBlobHandlers()

  try {
    if (req.method === 'POST' && route.kind === 'login') {
      const body = await readJson(req)
      const user = await auth.loginWithCredentials(body)
      return json(200, user)
    }

    if (req.method === 'GET' && route.kind === 'users') {
      return json(200, await auth.listSystemUsers())
    }

    if (req.method === 'POST' && route.kind === 'users') {
      const body = await readJson(req)
      const created = await auth.createSystemUser(body)
      return json(201, created)
    }

    if (req.method === 'PUT' && route.kind === 'user') {
      const body = await readJson(req)
      const updated = await auth.updateSystemUser(route.id, body)
      return json(200, updated)
    }

    if (req.method === 'DELETE' && route.kind === 'user') {
      await auth.deleteSystemUser(route.id)
      return json(200, { ok: true })
    }

    return json(404, { error: 'NOT_FOUND', path: url.pathname })
  } catch (err) {
    return json(err?.status || 500, { error: err?.message || 'ERROR' })
  }
}
