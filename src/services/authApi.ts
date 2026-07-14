import type { AuthUser } from './types'
import type {
  CreateSystemUserInput,
  SystemUserRecord,
  UpdateSystemUserInput,
} from './schoolStore'

async function parseError(res: Response): Promise<string> {
  const text = await res.text()
  try {
    const data = JSON.parse(text) as { error?: string }
    return data.error || 'ERROR'
  } catch {
    if (text.trimStart().startsWith('<!DOCTYPE') || text.trimStart().startsWith('<html')) {
      return 'SERVER_UNAVAILABLE'
    }
    return 'ERROR'
  }
}

export async function apiLogin(
  login: string,
  password: string,
  localAccounts: Array<{
    id: string
    login: string
    password: string
    role: AuthUser['role']
    displayName: string
    schoolId?: string
    jobRole?: string
    permissions?: string[]
  }> = [],
): Promise<AuthUser> {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, password, localAccounts }),
  })
  if (!res.ok) throw new Error(await parseError(res))
  const contentType = res.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) throw new Error('SERVER_UNAVAILABLE')
  return (await res.json()) as AuthUser
}

export async function apiListSystemUsers(): Promise<SystemUserRecord[]> {
  const res = await fetch('/api/system-users')
  if (!res.ok) throw new Error(await parseError(res))
  const contentType = res.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) throw new Error('SERVER_UNAVAILABLE')
  return (await res.json()) as SystemUserRecord[]
}

export async function apiCreateSystemUser(
  input: CreateSystemUserInput,
): Promise<SystemUserRecord> {
  const res = await fetch('/api/system-users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error(await parseError(res))
  return (await res.json()) as SystemUserRecord
}

export async function apiUpdateSystemUser(
  id: string,
  input: UpdateSystemUserInput,
): Promise<SystemUserRecord> {
  const res = await fetch(`/api/system-users/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error(await parseError(res))
  return (await res.json()) as SystemUserRecord
}

export async function apiDeleteSystemUser(id: string): Promise<void> {
  const res = await fetch(`/api/system-users/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error(await parseError(res))
}
