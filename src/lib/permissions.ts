export const PERMISSION_KEYS = [
  'dashboard',
  'schools',
  'teachers',
  'subjects',
  'workload',
  'map',
  'systemUsers',
] as const

export type PermissionKey = (typeof PERMISSION_KEYS)[number]

export const PERMISSION_PATHS: Record<PermissionKey, string> = {
  dashboard: '/',
  schools: '/schools',
  teachers: '/teachers',
  subjects: '/subjects',
  workload: '/workload',
  map: '/map',
  systemUsers: '/system-users',
}

const PATH_PERMISSIONS: { prefix: string; permission: PermissionKey }[] = [
  { prefix: '/system-users', permission: 'systemUsers' },
  { prefix: '/schools', permission: 'schools' },
  { prefix: '/teachers', permission: 'teachers' },
  { prefix: '/subjects', permission: 'subjects' },
  { prefix: '/workload', permission: 'workload' },
  { prefix: '/map', permission: 'map' },
]

export type PermissionUser = {
  id: string
  role: string
  permissions?: string[] | null
}

/** Built-in admin and legacy sessions without permissions keep full access. */
export function getUserPermissions(user: PermissionUser | null | undefined): PermissionKey[] | 'all' {
  if (!user || user.role !== 'admin') return []
  if (user.id === 'user-admin') return 'all'
  if (user.permissions == null) return 'all'
  return user.permissions.filter((p): p is PermissionKey =>
    (PERMISSION_KEYS as readonly string[]).includes(p),
  )
}

export function hasPermission(
  user: PermissionUser | null | undefined,
  permission: PermissionKey,
): boolean {
  const perms = getUserPermissions(user)
  if (perms === 'all') return true
  return perms.includes(permission)
}

export function permissionForPath(pathname: string): PermissionKey | null {
  if (pathname === '/' || pathname === '') return 'dashboard'
  const match = PATH_PERMISSIONS.find((item) => pathname === item.prefix || pathname.startsWith(`${item.prefix}/`))
  return match?.permission ?? null
}

export function canAccessPath(user: PermissionUser | null | undefined, pathname: string): boolean {
  if (user?.role === 'school') {
    return pathname.startsWith('/my-school')
  }
  const permission = permissionForPath(pathname)
  if (!permission) return true
  return hasPermission(user, permission)
}

export function firstAllowedPath(user: PermissionUser | null | undefined): string {
  if (user?.role === 'school') return '/my-school'
  const perms = getUserPermissions(user)
  if (perms === 'all') return '/'
  for (const key of PERMISSION_KEYS) {
    if (perms.includes(key)) return PERMISSION_PATHS[key]
  }
  return '/login'
}
