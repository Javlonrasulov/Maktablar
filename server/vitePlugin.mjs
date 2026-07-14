import {
  createSystemUser,
  deleteSystemUser,
  listSystemUsers,
  loginWithCredentials,
  updateSystemUser,
} from './authStore.mjs'

async function readBody(req) {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  if (!chunks.length) return {}
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')
  } catch {
    return {}
  }
}

function sendJson(res, status, data) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(data))
}

/**
 * Vite middleware: local file-backed auth API.
 */
export function authApiPlugin() {
  const mount = (server) => {
    server.middlewares.use(async (req, res, next) => {
      const url = req.url?.split('?')[0] ?? ''
      if (!url.startsWith('/api/')) return next()

      try {
        if (req.method === 'POST' && url === '/api/login') {
          const body = await readBody(req)
          const user = await loginWithCredentials(body)
          return sendJson(res, 200, user)
        }

        if (req.method === 'GET' && url === '/api/system-users') {
          return sendJson(res, 200, await listSystemUsers())
        }

        if (req.method === 'POST' && url === '/api/system-users') {
          const body = await readBody(req)
          const created = await createSystemUser(body)
          return sendJson(res, 201, created)
        }

        const updateMatch = url.match(/^\/api\/system-users\/([^/]+)$/)
        if (updateMatch && req.method === 'PUT') {
          const body = await readBody(req)
          const updated = await updateSystemUser(decodeURIComponent(updateMatch[1]), body)
          return sendJson(res, 200, updated)
        }

        if (updateMatch && req.method === 'DELETE') {
          await deleteSystemUser(decodeURIComponent(updateMatch[1]))
          return sendJson(res, 200, { ok: true })
        }

        return sendJson(res, 404, { error: 'NOT_FOUND' })
      } catch (err) {
        const status = err?.status || 500
        return sendJson(res, status, { error: err?.message || 'ERROR' })
      }
    })
  }

  return {
    name: 'navbahor-auth-api',
    configureServer: mount,
    configurePreviewServer: mount,
  }
}
